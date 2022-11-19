<?php

namespace App\Repository;

use App\Interfaces\IWarehouseRepository;
use App\Facades\SapRfcFacade;

class WarehouseRepository implements IWarehouseRepository
{
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

        $resMap = array_map(function ($value) {
            $arr['PLANT'] = $value['WERKS'];
            $arr['NAME1'] = $value['NAME1'];

            return $arr;
        }, $res);

        return $resMap;
    }
}
