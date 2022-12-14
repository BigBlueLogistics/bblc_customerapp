<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

use App\Traits\HttpResponse;
use App\Interfaces\IInventoryRepository;
use App\Interfaces\IMemberRepository;
use App\Exports\InventoryExport;

class InventoryController extends Controller
{
    use HttpResponse;

    private $inventory;
    private $members;

    public function __construct(IInventoryRepository $inventory, IMemberRepository $members)
    {
        $this->inventory = $inventory;
        $this->members = $members;
    }


    public function export(Request $request)
    {
        try {
            $customerCode = $request->input('customer_code');
            $warehouse = $request->input('warehouse');
            $format = $request->input('format');

            $export = new InventoryExport($this->inventory, $this->members);
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

    public function index(Request $request)
    {
        try {
            $customerCode = $request->input('customer_code');
            $warehouse = $request->input('warehouse');

            $res = $this->inventory->getStocksInventory($customerCode, $warehouse);

            return $this->sendResponse($res);
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }
}
