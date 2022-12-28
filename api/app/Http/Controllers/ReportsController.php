<?php

namespace App\Http\Controllers;

use App\Exports\Reports\WHSnapshotExport;
use App\Http\Requests\ReportRequest;
use App\Interfaces\IMemberRepository;
use App\Interfaces\IReportsRepository;
use App\Traits\HttpResponse;
use Maatwebsite\Excel\Facades\Excel;

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

    public function export(ReportRequest $request)
    {
        try {
            $request->validated($request->all());

            $customerCode = $request->input('customer_code');
            $warehouse = $request->input('warehouse');
            $format = $request->input('format');
            $reportType = $request->input('report_type');
            $groupBy = $request->input('group_by');

            if($reportType === "wh-snapshot"){
                $export = new WHSnapshotExport($this->reports, $this->members);
                $export->setFilterBy($customerCode, $warehouse, $groupBy);
            }

            if ($format === 'xlsx') {
                return Excel::download($export, 'report.xlsx', \Maatwebsite\Excel\Excel::XLSX, [
                    'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                ]);
            } else {
                return Excel::download($export, 'report.csv', \Maatwebsite\Excel\Excel::CSV, [
                    'Content-Type' => 'text/csv',
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

            $reportType = $request->input('report_type');
            $customerCode = $request->input('customer_code');
            $warehouse = $request->input('warehouse');
            $start_date = $request->input('start_date');
            $end_date = $request->input('end_date');
            $groupBy = $request->input('group_by');

            if ($reportType === 'wh-snapshot') {
                $res = $this->reports->getWhSnapshot($customerCode, $warehouse, $groupBy);
            }
            if ($reportType === 'stock-status') {
                $res = $this->reports->getStocks($customerCode, $warehouse, $start_date, $end_date);
            }
            if ($reportType === 'aging-report') {   
                $res = $this->reports->getAging($customerCode, $warehouse, $groupBy);
            }
            
            return $this->sendResponse($res);
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }
}
