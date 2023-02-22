<?php

namespace App\Http\Controllers;

use App\Http\Requests\Order\CreateRequest;
use App\Http\Requests\Order\ExpiryBatchRequest;
use App\Http\Requests\Order\MaterialRequest;
use App\Http\Requests\Order\ProductUnitsRequest;
use App\Interfaces\IOrderRepository;
use App\Models\OrderHeader;
use App\Models\OrderItems;
use App\Traits\HttpResponse;
use Carbon\Carbon;
use DB;

class OrderController extends Controller
{
    use HttpResponse;

    private $order;

    public function __construct(IOrderRepository $order)
    {
        $this->order = $order;
    }

    public function materialAndDescription(MaterialRequest $request)
    {
        try {
            $request->validated($request->all());

            $result = $this->order->materialAndDescription($request->customerCode);

            return $this->sendResponse($result, 'descriptions');
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    public function productUnits(ProductUnitsRequest $request)
    {
        try {
            $request->validated($request->all());

            $result = $this->order->productUnits($request->materialCode);

            return $this->sendResponse($result, 'units');
        } catch (\Exception $e) {
            return $this->sendError($e);
        }
    }

    public function expiryBatch(ExpiryBatchRequest $request)
    {
        try {
            $request->validated($request->all());

            $result = $this->order->expiryBatch($request->materialCode, $request->warehouseNo);

            return $this->sendResponse($result, 'units');
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    public function index()
    {
        try {
            $orders = OrderHeader::select([
                'transid', 'ponum AS ref_number', 'apstat AS status',
                Db::raw("FORMAT(erdat, 'MMM, dd yyyy') AS created_date"),
                Db::raw("CONVERT(VARCHAR(11), CAST(ertim AS TIME), 100) AS created_time"),
                'updated_at',
            ])->get();

            return $this->sendResponse($orders, 'get orders list');
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    public function create(CreateRequest $request)
    {
        try {
            $request->validated($request->all());

            $authUser = auth()->user();
            $currentDatetime = Carbon::now();

            // Insert order details
            $orderHeader = OrderHeader::create([
                'lgnum' => $request->source_wh,
                'ponum' => $request->ref_number,
                'pudat' => $request->pickup_date,
                'miles' => $request->allow_notify,
                'header' => $request->instruction,
                'ernam' => $authUser->id,
                'apstat' => $authUser->role_id,
                'erdat' => $currentDatetime->format('m/d/Y'),
                'ertim' => $currentDatetime->format('H:i:s'),
            ]);

            if ($orderHeader) {
                $id = $orderHeader['transid'];
                $createdOrder = OrderHeader::where('id', $id)->first(['transid', 'lgnum']);

                $mappedData = $createdOrder->withMapOrderDetails($request->requests);

                // Bulk insert order items
                OrderItems::insert($mappedData);
            }

            return $this->sendResponse([
                'id' => $createdOrder['transid'],
            ], 'Successfully created order request');
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    public function edit($transId)
    {
        try {
            $orders = OrderHeader::find($transId);

            if($orders){
                $orders = $orders->toFormattedOrderDetails();
            }

            return $this->sendResponse($orders, 'request order details');
        }
        catch (Exception $e)
        {
            return $this->sendError($e);
        }
    }

    protected function withUpdateMapOrderDetails(array $request, array $moreData = [])
    {
        $collection = collect($request);

        return $collection->map(function ($field) use ($moreData) {
            return [
                ...$moreData,
                'uuid'  => $field['uuid'],
                'matnr' => $field['material'],
                'quan'  => $field['qty'],
                'meinh' => $field['units'],
                'charg' => $field['batch'],
                'vfdat' => $field['expiry'],
            ];
        })->all();
    }

    public function update(CreateRequest $request, $transId)
    {
        try{
            $request->validated($request->all());

            $header = OrderHeader::find($transId);

            if(!$header){
               return $this->sendError("Transaction ID not exists", 422);
            }

            $header->lgnum = $request->source_wh;
            $header->ponum = $request->ref_number;
            $header->pudat = $request->pickup_date;
            $header->miles = $request->allow_notify;
            $header->header= $request->instruction;
            $isSuccess = $header->save();

            if($isSuccess){
                $mapRequests = $this->withUpdateMapOrderDetails($request->requests, ['lgnum' => $header->lgnum, 'transid' => $header->transid]);

                // DB::unprepared('SET IDENTITY_INSERT order_items ON');
                $items = OrderItems::upsert($mapRequests, ['uuid','transid'], ['lgnum','matnr','quan','meinh','charg','vfdat']);
                // DB::unprepared('SET IDENTITY_INSERT order_items OFF');
            }
    
            return $this->sendResponse($items);
        }
        catch (Exception $e)
        {
            return $this->sendError($e);
        }
    }
}