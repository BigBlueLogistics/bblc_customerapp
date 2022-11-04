<?php

namespace App\Http\Controllers\WAREHOUSE;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

use App\Facades\SapRfcFacade;
use App\Traits\HttpResponse;
use App\Interfaces\IInventoryRepository;
use App\Exports\InventoryExport;

class InventoryController extends Controller
{
    use HttpResponse;

    private $inventory;

    public function __construct(IInventoryRepository $inventory)
    {
        $this->inventory = $inventory;
    }

    public function warehouseList()
    {
        $mandt = SapRfcFacade::getMandt();
        $res = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'T001W')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT = {$mandt}"],
                ['TEXT' => " AND WERKS LIKE 'BB%'"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'WERKS'],
                ['FIELDNAME' => 'NAME1'],
            ])
            ->getDataToArray();

        $wh = array_map(function ($value) {
            $arr['PLANT'] = $value['WERKS'];
            $arr['NAME1'] = $value['NAME1'];

            return $arr;
        }, $res);

        return $this->sendResponse($wh, 'List of warehouse');
    }

    public function export(Request $request)
    {
        $customerCode = $request->input('customer_code');
        $warehouse = $request->input('warehouse');
        $format = $request->input('format');

        $export = new InventoryExport($this->inventory);
        $export->setFilterBy($customerCode, $warehouse);

        if ($format === 'excel') {
            return Excel::download($export, 'inventory.xlsx', \Maatwebsite\Excel\Excel::XLSX);
        } else {
            return Excel::download($export, 'inventory.csv', \Maatwebsite\Excel\Excel::CSV, [
                'Content-Type' => 'text/csv'
            ]);
        }
    }

    public function table(Request $request)
    {
        try {
            $customerCode = $request->input('customer_code');
            $warehouse = $request->input('warehouse');
            $groupBy = $request->input('group_by');

            $res = $this->inventory->getStocksInventory($customerCode, $warehouse, $groupBy);

            return $this->sendResponse($res);
        } catch (SapException $ex) {
            return $this->sendError($ex, 500);
        }
    }
}
