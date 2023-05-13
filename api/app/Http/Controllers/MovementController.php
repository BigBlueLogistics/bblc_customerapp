<?php

namespace App\Http\Controllers;

use App\Traits\HttpResponse;
use App\Interfaces\IMovementRepository;
use App\Http\Requests\MovementRequest;

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
            $fromDate = $request->input('from_date');
            $toDate = $request->input('to_date');
            $warehouseNo = $request->input('warehouse_no');
            $movementType = $request->input('movement_type');

            if($movementType === "outbound"){
                $res = $this->movement->outboundMov($materialCode, $fromDate, $toDate, $warehouseNo);
            }
            else if($movementType === "inbound"){
                $res = $this->movement->inboundMov($materialCode, $fromDate, $toDate, $warehouseNo);
            }

            return $this->sendResponse($res, "Movements details");
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }   
}
