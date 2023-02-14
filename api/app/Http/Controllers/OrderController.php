<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use App\Interfaces\IOrderRepository;
use App\Traits\HttpResponse;

class OrderController extends Controller
{
    use HttpResponse;

    private $order;

    public function __construct(IOrderRepository $order)
    {
        $this->order = $order;
    }

    public function materialAndDescription(Request $request)
    {
        try {
            $customerCode = $request->input('customerCode');
            $result =  $this->order->materialAndDescription($customerCode);

            return $this->sendResponse($result, 'descriptions');
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    public function productUnits(Request $request)
    {
        try {
            $materialCode = $request->input('materialCode');
            $result = $this->order->productUnits($materialCode);

            return $this->sendResponse($result, 'units');
        } catch (\Exception $e) {
            return $this->sendError($e);
        }
    }

    public function expiryBatch(Request $request)
    {
        try {
            $materialCode = $request->input('materialCode');
            $warehouseNo = $request->input('warehouseNo');

            $result = $this->order->expiryBatch($materialCode, $warehouseNo);

            return $this->sendResponse($result, 'units');
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }
}
