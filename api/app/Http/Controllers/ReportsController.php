<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

use App\Traits\HttpResponse;
use App\Interfaces\IReportsRepository;
use App\Interfaces\IMemberRepository;
use App\Exports\ReportsExport;
use App\Http\Requests\ReportRequest;

class ReportsController extends Controller
{
    use HttpResponse;

    private $reports;
    private $members;

    public function __construct(IReportsRepository $reports, IMemberRepository $members)
    {
        $this->reports = $reports;
        $this->members = $members;
    }

    public function export(Request $request)
    {
        try {
            $customerCode = $request->input('customer_code');
            $warehouse = $request->input('warehouse');
            $format = $request->input('format');

            $export = new ReportsExport($this->reports, $this->members);
            $export->setFilterBy($customerCode, $warehouse);

            if ($format === "xlsx") {
                return Excel::download($export, 'inventory.xlsx', \Maatwebsite\Excel\Excel::XLSX, [
                        'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    ]);
            } else {
                return Excel::download($export, 'inventory.csv', \Maatwebsite\Excel\Excel::CSV, [
                    'Content-Type' => 'text/csv'
                ]);
            }
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    public function index(ReportRequest $request)
    {
        try {
            $request->validated($request->all());

            if($request->report_type === 'wh-snapshot'){
                $res = $this->reports->getWhSnapshot($request->customer_code, $request->warehouse, $request->group_by);
            }
            if($request->report_type === 'stock-status'){
                $res = $this->reports->getStocks($request->customer_code, $request->warehouse, $request->start_date, $request->end_date);
            }

            return $this->sendResponse($res);
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }
}
