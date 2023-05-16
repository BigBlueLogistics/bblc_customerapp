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
                $res = $this->movement->outboundMov($materialCode, $formatFromDate, $formatToDate, $warehouseNo);
            }
            else if($movementType === "inbound"){
                $res = $this->movement->inboundMov($materialCode, $formatFromDate, $formatToDate, $warehouseNo);
            }
            else{
                $res = $this->movement->mergeInOutbound($materialCode, $formatFromDate, $formatToDate, $warehouseNo);
            }   

            return $this->sendResponse($res, "Movements details");
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }   
}
