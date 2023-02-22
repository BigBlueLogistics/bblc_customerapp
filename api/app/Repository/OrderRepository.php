<?php

namespace App\Repository;

use Carbon\Carbon;
use App\Facades\SapRfcFacade;
use App\Interfaces\IOrderRepository;
use App\Traits\StringEncode;

class OrderRepository implements IOrderRepository
{
    use StringEncode;

    public function materialAndDescription($customerCode)
    {
        $mandt = SapRfcFacade::getMandt();
        $makt = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
        ->param('QUERY_TABLE', 'MAKT')
        ->param('DELIMITER', ';')
        ->param('OPTIONS', [
            ['TEXT' => "MANDT EQ {$mandt}"],
            ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
        ])
        ->param('FIELDS', [
            ['FIELDNAME' => 'MATNR'], // material
            ['FIELDNAME' => 'MAKTX'], // description
        ])
        ->getDataToArray();

        $collectionMakt = collect($makt)->map(function($item, $index){
            return [
                "id" => $index += 1,
                "material" => $item['MATNR'],
                "description" => $item['MAKTX'],
            ];
        });


        return $collectionMakt;
    }

    public function expiryBatch($materialCode, $warehouseNo)
    {
        $warehouseNo = str_replace('BB', 'WH', $warehouseNo);

        $result = SapRfcFacade::functionModule('ZFM_EWM_TABLEREAD')
        ->param('IV_CUSTOMER', $materialCode)
        ->param('IV_WAREHOUSENO', $warehouseNo)
        ->getData();

        $products = $this->convert_latin1_to_utf8_recursive($result["T_SCWM_AQUA"]);

        $collectionProducts = collect($products)->map(function($item, $index){
            $expiry = Carbon::parse($item['VFDAT'])->format('m-d-Y');

            return [
                "id" => $index += 1,
                "code" => $item['MATNR'],
                "batch" => $item['CHARG'],
                "expiry" => $expiry,
                "quantity" => round( (float)$item['QUAN'], 3)
            ];
        });

        return $collectionProducts;
    }

    public function productUnits($materialCode)
    {
        $mandt = SapRfcFacade::getMandt();
        $marm = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
        ->param('QUERY_TABLE', 'MARM')
        ->param('DELIMITER', ';')
        ->param('OPTIONS', [
            ['TEXT' => "MANDT EQ {$mandt}"],
            ['TEXT' => " AND MATNR EQ '{$materialCode}'"],
            ['TEXT' => " AND MEINH NE 'KG'"],
        ])
        ->param('FIELDS', [
            ['FIELDNAME' => 'UMREZ'], 
            ['FIELDNAME' => 'UMREN'], 
            ['FIELDNAME' => 'MEINH'], 
        ])
        ->getDataToArray();


        if(count($marm)){
            $collectionMarm = collect($marm)->map(function($item){
                 $unit =  is_null($item['MEINH']) ? 'KG' : $item['MEINH'];
                 $fixedWt = is_null($item['UMREZ']) ? 1 : (float) $item['UMREZ'] / (float) $item['UMREN'];

                return round($fixedWt, 3) ." / ". $unit;
            });
        } 
        else{
            $collectionMarm = ["1 / KG"];
        }

        return $collectionMarm;
    }

}
