<?php

namespace App\Http\Controllers;

use App\Traits\HttpResponse;
use App\Interfaces\IMovementRepository;
use App\Http\Requests\MovementRequest;
use Carbon\Carbon;

class MovementController extends Controller
{
    use HttpResponse;

    private $movement;

    public function __construct(IMovementRepository $movement)
    {
        $this->movement = $movement;
    }

    public function index(MovementRequest $request)
    {
        try {
            $request->validated($request->all());

            $materialCode = $request->input('material_code');
            [$fromDate, $toDate] = $request->input('coverage_date');
            $warehouseNo = $request->input('warehouse_no');
            $movementType = $request->input('movement_type');
 
            $formatFromDate = Carbon::parse($fromDate)->format('Ymd');
            $formatToDate = Carbon::parse($toDate)->format('Ymd');

            if($movementType === "outbound"){
                $formatWarehouse = str_replace('BB', 'W', $warehouseNo);
                $res = $this->movement->outboundMov($materialCode, $formatFromDate, $formatToDate, $formatWarehouse);
            }
            else if($movementType === "inbound"){
                $formatWarehouse = str_replace('BB', 'WH', $warehouseNo);
                $res = $this->movement->inboundMov($materialCode, $formatFromDate, $formatToDate, $formatWarehouse);
            }

            return $this->sendResponse($res, "Movements details");
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }   
}
