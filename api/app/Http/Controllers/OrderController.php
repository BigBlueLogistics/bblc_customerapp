<?php

namespace App\Http\Controllers;

use App\Http\Requests\Order\AdhocDetailsRequest;
use App\Http\Requests\Order\CreateAdhocRequest;
use App\Http\Requests\Order\CreateRequest;
use App\Http\Requests\Order\ExpiryBatchRequest;
use App\Http\Requests\Order\ListRequest;
use App\Http\Requests\Order\MaterialRequest;
use App\Http\Requests\Order\ProductUnitsRequest;
use App\Http\Requests\Order\CreateUploadRequest;
use App\Http\Requests\Order\UpdateUploadRequest;
use App\Interfaces\IOrderRepository;
use App\Models\OrderHeader;
use App\Models\OrderItems;
use App\Models\OrderStatus;
use App\Traits\HttpResponse;
use Carbon\Carbon;
use DB;
use Exception;

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
            $customerCode = $request->input('customerCode');
            $warehouseNo = $request->input('warehouseNo');

            $result = $this->order->materialAndDescription($customerCode, $warehouseNo);

            return $this->sendResponse($result, 'materials and descriptions');
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    public function productUnits(ProductUnitsRequest $request)
    {
        try {
            $request->validated($request->all());
            $materialCode = $request->input('materialCode');

            $result = $this->order->productUnits($materialCode);

            return $this->sendResponse($result, 'units');
        } catch (\Exception $e) {
            return $this->sendError($e);
        }
    }

    public function expiryBatch(ExpiryBatchRequest $request)
    {
        try {
            $request->validated($request->all());
            $materialCode = $request->input('materialCode');
            $warehouseNo = $request->input('warehouseNo');

            $result = $this->order->expiryBatch($materialCode, $warehouseNo);

            return $this->sendResponse($result, 'units');
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    public function index(ListRequest $request)
    {
        try {
            $request->validated($request->all());

            $filterStatus = $request->input('status');
            $filterCreatedAt = $request->input('created_at');
            $filterModifiedAt = $request->input('last_modified');

            $orders = OrderHeader::select([
                'order_header.transid', 'order_header.ponum AS ref_number', 'order_status.name AS status',
                'order_status.id AS status_id',
                Db::raw("FORMAT(order_header.erdat, 'MMM, dd yyyy') AS created_date"),
                Db::raw('CONVERT(VARCHAR(11), CAST(order_header.ertim AS TIME), 100) AS created_time'),
                Db::raw("FORMAT(order_header.updated_at, 'MMM, dd yyyy hh:mmtt') AS last_modified"),
            ])
                ->where('lgnum', '!=', null)
                ->where('ernam', auth()->id())
                ->where('apstat', '!=', 6)
                ->when($filterStatus, function ($query, $filterStatus) {
                    $query->where('apstat', '=', $filterStatus);
                })
                ->when($filterCreatedAt, function ($query, $filterCreatedAt) {
                    $query->whereDate('erdat', '=', Carbon::parse($filterCreatedAt));
                })
                ->when($filterModifiedAt, function ($query, $filterModifiedAt) {
                    $query->whereDate('order_header.updated_at', '=', Carbon::parse($filterModifiedAt));
                })
                ->leftjoin('order_status', 'order_header.apstat', '=', 'order_status.id')
                ->get();

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

            // Insert order header
            // NOTE: transid is auto generated in model OrderHeader
            $orderHeader = OrderHeader::create([
                'lgnum' => $request->input('source_wh'),
                'ponum' => $request->input('ref_number'),
                'pudat' => $request->input('pickup_date'),
                'miles' => $request->input('allow_notify'),
                'header' => $request->input('instruction'),
                'kunnr' => $request->input('customer_code'),
                'ernam' => $authUser->id,
                'apstat' => 0,
                'access' => 0,
                'erdat' => $currentDatetime->format('m/d/Y'),
                'ertim' => $currentDatetime->format('H:i:s'),
            ]);

            if ($orderHeader) {
                $id = $orderHeader['transid'];
                $createdOrder = OrderHeader::where('id', $id)->first(['transid', 'lgnum']);

                $orders = $request->input('requests');
                $mappedData = $createdOrder->withMapOrderDetails($orders);
                $transId = $createdOrder['transid'];

                // Bulk insert order items
                OrderItems::insert($mappedData);

                return $this->sendResponse([
                    'id' => $transId,
                ], 'Successfully created product request');
            }

            return $this->sendError('Failed to create product request');

        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }
    }

    public function edit($transId)
    {
        try {
            $orders = OrderHeader::find($transId);
            if ($orders) {
                $orders = $orders->toFormattedOrderDetails();

                $orders['attachment'] = $this->order->retrieveFile($transId);
            }

            return $this->sendResponse($orders, 'Request order details');
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    protected function withUpdateMapOrderDetails(array $request, array $moreData = [])
    {
        $collection = collect($request);

        return $collection->map(function ($field) use ($moreData) {
            return [
                ...$moreData,
                'uuid' => $field['uuid'],
                'matnr' => $field['material'],
                'quan' => $field['qty'],
                'meinh' => $field['units'],
                'charg' => $field['batch'],
                'vfdat' => $field['expiry'],
                'remarks' => $field['remarks'] ?? null,
            ];
        })->all();
    }

    public function update(CreateRequest $request, $transId)
    {
        try {
            $request->validated($request->all());

            $header = OrderHeader::find($transId);
            if (! $header) {
                return $this->sendError('Transaction ID not exists');
            }

            if ($header->apstat != 0) {
                return $this->sendError('Sorry! this order cannot no longer to update.');
            }

            $header->lgnum = $request->input('source_wh');
            $header->ponum = $request->input('ref_number');
            $header->pudat = $request->input('pickup_date');
            $header->miles = $request->input('allow_notify');
            $header->header = $request->input('instruction');
            $isSuccess = $header->save();

            if ($isSuccess) {
                // Get the inserted order header details
                $mapRequests = $this->withUpdateMapOrderDetails($request->input('requests'), ['lgnum' => $header->lgnum, 'transid' => $header->transid]);

                // Insert if uuid and transid not exist else it updates the record.
                OrderItems::upsert($mapRequests, ['uuid', 'transid'], ['lgnum', 'matnr', 'quan', 'meinh', 'charg', 'vfdat', 'remarks']);

                // Delete existing order items
                if ($request->input('requestsDelete')) {
                    OrderItems::whereIn('uuid', $request->input('requestsDelete'))
                        ->where('transid', $header->transid)
                        ->delete();
                }

                // Get updated data
                $updatedOrders = OrderHeader::find($transId);
                if ($updatedOrders) {
                    $updatedOrders = $updatedOrders->toFormattedOrderDetails();
                    $updatedOrders['attachment'] = $this->order->retrieveFile($transId);
                }

                return $this->sendResponse($updatedOrders, 'Successfully update product request');
            }

            return $this->sendError('Failed to update product request');            
        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }
    }

    public function cancel($transId)
    {
        try {
            $header = OrderHeader::find($transId);

            if (! $header) {
                return $this->sendError('Transaction ID not exists');
            }
            if ($header->apstat > 0) {
                return $this->sendError('Cannot cancel this request', 422);
            }

            // 6 = cancelled
            $header->apstat = 6;
            $header->save();

            return $this->sendResponse(null, 'Request has been cancel');
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    public function statusList()
    {
        try {
            $status = OrderStatus::select(['id', 'name'])
                ->where('id', '!=', '6')
                ->get();

            return $this->sendResponse($status, 'Order status list');
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    public function adhocDetails(AdhocDetailsRequest $request)
    {
        try {
            $request->validated($request->all());

            $docNo = $request->input('docNo');
            $customerCode = $request->input('customer_code');

            $details = $this->order->adhocDetails($customerCode, $docNo);

            if ($details['status'] === 'failed') {
                return $this->sendError($details['message']);
            }

            return $this->sendResponse($details, 'Outbound details');
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    public function createAdhocRequest(CreateAdhocRequest $request)
    {
        try {
            $request->validated($request->all());
            $authUser = auth()->user();

            $adhocRequest = $this->order->createAdhocRequest($request, $authUser);

            if ($adhocRequest) {
                return $this->sendResponse(null, $adhocRequest);
            }

            return $this->sendError('Failed request notification');

        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    public function createFileUpload(CreateUploadRequest $request)
    {
        try {
            $request->validated();

            $authUser = auth()->user();
            $currentDatetime = Carbon::now();

            // Insert order header
            // NOTE: transid is auto generated in model OrderHeader
            $orderHeader = OrderHeader::create([
                'kunnr' => $request->input('customer_code'),
                'ernam' => $authUser->id,
                'apstat' => 0,
                'access' => 0,
                'erdat' => $currentDatetime->format('m/d/Y'),
                'ertim' => $currentDatetime->format('H:i:s'),
                'apnam' => $authUser->id,
            ]);

            if($orderHeader){
                $id = $orderHeader['transid'];
                $createUpload = OrderHeader::where('id', $id)->first(['transid']);
                $transId = $createUpload['transid'];

                // Upload file
                $this->order->uploadFile($request, $transId);

                return $this->sendResponse([
                    'id' => $transId,
                ], 'Successfully uploaded product request');
            }

            return $this->sendError('Failed to upload product request');
        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }
    }

    public function updateFileUpload(UpdateUploadRequest $request, $transId)
    {
        try {
            $request->validated();

            $updatedFileData = null;

            $header = OrderHeader::find($transId);
            if (! $header) {
                return $this->sendError('Transaction ID not exists');
            }

            if ($header->apstat != 0) {
                return $this->sendError('Sorry! this order cannot no longer to update.');
            }

            // Delete file
            $filesToDelete = $request->input('attachmentDelete');
            $this->order->deleteFile($filesToDelete, $transId);

            // Upload file
            $this->order->uploadFile($request, $transId);

            // Get updated files
            $updatedFileData['attachment'] = $this->order->retrieveFile($transId);
    
            $updatedFileData['transid'] = $transId;

            return $this->sendResponse($updatedFileData, 'Successfully update uploaded product request');
            
        } catch (Exception $e) {
            return $this->sendError($e->getMessage());
        }
    }
}
