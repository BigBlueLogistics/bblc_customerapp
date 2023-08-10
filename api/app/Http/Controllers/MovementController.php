<?php

namespace App\Http\Controllers;

use App\Traits\HttpResponse;
use App\Interfaces\IMovementRepository;
use App\Interfaces\IMemberRepository;
use App\Http\Requests\MovementRequest;
use App\Exports\MovementExport;
use Carbon\Carbon;
use Exception;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Http\Request;

class MovementController extends Controller
{
    use HttpResponse;

    private $movement;

    private $member;

    public function __construct(IMovementRepository $movement, IMemberRepository $member)
    {
        $this->movement = $movement;
        $this->member = $member;
    }

    public function index(MovementRequest $request)
    {
        try {
            $request->validated($request->all());

            $warehouseNo = $request->input('warehouse_no');
            $movementType = $request->input('movement_type');
            $materialCode = $request->input('material_code');
            $customerCode = $request->user()->company()->value('customer_code');
            [$fromDate, $toDate] = $request->input('coverage_date');
 
            $formatFromDate = Carbon::parse($fromDate)->format('Ymd');
            $formatToDate = Carbon::parse($toDate)->format('Ymd');

            if($movementType === "outbound"){
                $res = $this->movement->outboundMov($materialCode, $formatFromDate, $formatToDate, $warehouseNo, $customerCode);
            }
            else if($movementType === "inbound"){
                $res = $this->movement->inboundMov($materialCode, $formatFromDate, $formatToDate, $warehouseNo, $customerCode);
            }
            else{
                $res = $this->movement->mergeInOutbound($materialCode, $formatFromDate, $formatToDate, $warehouseNo, $customerCode);
            }   

            return $this->sendResponse($res, "Movements details");
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

     public function outboundMovExcel(MovementRequest $request)
     {
        $request->validated($request->all());

        $warehouseNo = $request->input('warehouse_no');
        $movementType = $request->input('movement_type');
        $materialCode = $request->input('material_code');
        $customerCode = $request->user()->company()->value('customer_code');
        [$fromDate, $toDate] = $request->input('coverage_date');

        $formatFromDate = Carbon::parse($fromDate)->format('Ymd');
        $formatToDate = Carbon::parse($toDate)->format('Ymd');

        $res = $this->movement->outboundMovExcel($materialCode, $formatFromDate, $formatToDate, $warehouseNo, $customerCode);

        return $this->sendResponse($res);
     }

    public function export(MovementRequest $request)
    {
        try {
            $request->validated($request->all());

            $warehouseNo = $request->input('warehouse_no');
            $materialCode = $request->input('material_code');
            $movementType = $request->input('movement_type');
            $coverageDate = $request->input('coverage_date');
            $customerCode = $request->input('customer_code');
            $format = $request->input('format');

            $export = new MovementExport($this->movement, $this->member);
            $export->setFilterBy($customerCode, $warehouseNo, $materialCode, $movementType, $coverageDate);

            if ($format === 'xlsx') {
                return Excel::download($export, 'movements.xlsx', \Maatwebsite\Excel\Excel::XLSX, [
                    'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ]);
            } else {
                return Excel::download($export, 'movements.csv', \Maatwebsite\Excel\Excel::CSV, [
                    'Content-Type' => 'text/csv',
                ]);
            }
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    public function materialDescription(Request $request)
    {
        try {
            $customerCode = $request->input('customer_code');

            $res = $this->movement->materialAndDescription($customerCode);
            return $this->sendResponse($res);
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    public function outboundSubDetails(Request $request){
        try {
            $documentNo = $request->input('documentNo');
            $documentNoRef = $request->input('documentNoRef');

            $res = $this->movement->outboundSubDetails($documentNo, $documentNoRef);
            return $this->sendResponse($res);
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }
}
