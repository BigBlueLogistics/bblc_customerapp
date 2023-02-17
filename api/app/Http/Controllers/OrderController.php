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

    protected function mapToTableFields(array $data, array $miscData)
    {
        $collection = collect($data);

        return $collection->map(function ($field) use ($miscData) {
            return [
                ...$miscData,
                'matnr' => $field['material'],
                'quan' => $field['qty'],
                'meinh' => $field['units'],
                'charg' => $field['batch'],
                'vfdat' => $field['expiry'],
            ];
        })->all();
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
            $warehouseNo = str_replace('BB', 'WH', $request->source_wh);

            // Insert order details
            $orderHeader = OrderHeader::create([
                'lgnum' => $warehouseNo,
                'ponum' => $request->ref_number,
                'pudat' => $request->pickup_date,
                'miles' => $request->allow_notify == 'true' ? 1 : 0,
                'header' => $request->instruction,
                'ernam' => $authUser->id,
                'apstat' => $authUser->role_id,
                'erdat' => $currentDatetime->format('m/d/Y'),
                'ertim' => $currentDatetime->format('H:i:s'),
            ]);

            if ($orderHeader) {
                $id = $orderHeader['transid'];
                $orderDetails = OrderHeader::where('id', $id)->first(['transid', 'lgnum'])->toArray();

                $mappedData = $this->mapToTableFields($request->requests, $orderDetails);

                // Bulk insert order items
                OrderItems::insert($mappedData);
            }

            return $this->sendResponse([
                'id' => $orderDetails['transid'],
            ], 'Successfully created order request');
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }
}
