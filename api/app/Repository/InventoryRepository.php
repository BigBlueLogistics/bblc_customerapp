<?php

namespace App\Repository;

use App\Interfaces\IInventoryRepository;
use App\Facades\SapRfcFacade;
use App\Traits\StringEncode;

class InventoryRepository implements IInventoryRepository
{
    use StringEncode;

    public function getStocksInventory($customerCode, $warehouseNo)
    {
        $mandt = SapRfcFacade::getMandt();
        $warehouseNo = str_replace('BB', 'WH', $warehouseNo);

        // Get Material no. and description, available,
        // allocated and restricted stocks
        $result = SapRfcFacade::functionModule('ZFM_EWM_TABLEREAD')
            ->param('IV_CUSTOMER', $customerCode)
            ->param('IV_WAREHOUSENO', $warehouseNo)
            ->getData();

        $utf8_data = $this->convert_latin1_to_utf8_recursive($result);

        // Get fixed weight
        $fixedWt = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'MARM')
            ->param('DELIMITER', ';')
            ->param('SORT_FIELDS', 'MEINH')
            ->param('ORDER_BY_COLUMN', '1')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ {$mandt}"],
                ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
                ['TEXT' => " AND MEINH NE 'KG'"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'MATNR'],
                ['FIELDNAME' => 'MEINH'],
                ['FIELDNAME' => 'UMREZ'],
                ['FIELDNAME' => 'UMREN'],
            ])
            ->getDataToArray();

        $collectionProducts = collect($utf8_data["T_SCWM_AQUA"]);
        $collectionFixedWt = collect($fixedWt);

        $groupProductDetails = $collectionProducts->groupBy('MATNR')
                ->map(function ($group) {
                    // Add up allocated, available and restricted
                    $allocatedWt = $group->reduce(function ($total, $current) {
                        if ($current['LGTYP'] === 'GIZN') {
                            $total += (float)$current['QUAN'];
                        }
                        return $total;
                    }, 0);
                    $restrictedWt = $group->reduce(function ($total, $current) {
                        if (in_array(strtoupper($current['CAT']), ['K1','B1'])) {
                            $total += (float)$current['QUAN'];
                        }
                        return $total;
                    }, 0);
                    $availableWt = $group->reduce(function ($total, $current) {
                        if (!in_array(strtoupper($current['CAT']), ['K1','B1']) && $current['LGTYP'] !== 'GIZN') {
                            $total += (float)$current['QUAN'];
                        }
                        return $total;
                    }, 0);

                    return [
                        'materialCode' => $group[0]['MATNR'],
                        'description' => $group[0]['MAKTX'],
                        'allocatedWt' => round($allocatedWt, 3),
                        'restrictedWt' => round($restrictedWt, 3),
                        'availableWt' => round($availableWt, 3),
                    ];
                });

        $keyedFixedWt = $collectionFixedWt->mapWithKeys(function ($item) {
            return [
                $item['MATNR'] => [
                    'unit' => is_null($item['MEINH']) ? "KG" : $item['MEINH'],
                    'fixedWt' =>  is_null($item['UMREZ']) ? 1 : (float)$item['UMREZ'] / (float)$item['UMREN'],
                ]
            ];
        });

        $mergedProducts = $groupProductDetails->mergeRecursive($keyedFixedWt)
                        ->filter(function ($data) {
                            // Return only data if anyone of the field below has value.
                            return (
                                array_key_exists('availableWt', $data)
                             || array_key_exists('allocatedWt', $data)
                             || array_key_exists('restrictedWt', $data)
                            );
                        })
                        ->map(function ($data) {
                            $fixedWt = array_key_exists('fixedWt', $data) ? $data['fixedWt'] : 1;
                            $availableWt = array_key_exists('availableWt', $data) ? $data['availableWt'] : 0;
                            $allocatedWt = array_key_exists('allocatedWt', $data) ? $data['allocatedWt'] : 0;
                            $restrictedWt = array_key_exists('restrictedWt', $data) ? $data['restrictedWt'] : 0;

                            // Calculate the quantity.
                            $availableQty = $availableWt / $fixedWt;
                            $allocatedQty = $allocatedWt / $fixedWt;
                            $restrictedQty = $restrictedWt / $fixedWt;

                            // Quantity
                            $res['availableQty'] = $availableQty;
                            $res['allocatedQty'] = $allocatedQty;
                            $res['restrictedQty'] = $restrictedQty;
                            $res['totalQty'] = $availableQty + $allocatedQty + $restrictedQty;

                            // Weight
                            $res['availableWt'] = $availableWt;
                            $res['allocatedWt'] = $allocatedWt;
                            $res['restrictedWt'] = $restrictedWt;

                            return array_merge($data, $res);
                        })
                        ->all();
        $result = count($mergedProducts) > 0 ? array_values($mergedProducts) : [];

        return $result;
    }


   public function getCustomerInfo($customerCode)
   {
       $mandt = SapRfcFacade::getMandt();
       $customer = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'KNA1')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ {$mandt}"],
                ['TEXT' => " AND KUNNR EQ '{$customerCode}'"]
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'NAME1'], // customer fullname
                ['FIELDNAME' => 'STRAS'], // strict name
                ['FIELDNAME' => 'ORT01'], // city
                ['FIELDNAME' => 'LAND1'], // country
                ['FIELDNAME' => 'PSTLZ'], // zip code
                ['FIELDNAME' => 'TELF1'], // telephone
            ])
       ->getDataToArray();

       if (count($customer)) {
           return [
               'name' => $customer[0]['NAME1'],
               'address' => $customer[0]['STRAS'] . ", ". $customer[0]['ORT01'] . ", " . $customer[0]['LAND1'] . ", ". $customer[0]['PSTLZ'],
               'phone' => $customer[0]['TELF1']
           ];
       }
       return [];
   }
}
