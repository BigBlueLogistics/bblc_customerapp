<?php

namespace App\Repository;

use App\Interfaces\IInventoryRepository;
use App\Facades\SapRfcFacade;
use App\Traits\StringEncode;

class InventoryRepository implements IInventoryRepository
{
    use StringEncode;

    // public function getStocksInventory($customerCode, $warehouseNo, $groupBy = "material")
    // {
    //     $result = SapRfcFacade::functionModule('ZFM_EWM_TABLEREAD')
    //         ->param('IV_CUSTOMER', $customerCode)
    //         ->param('IV_WAREHOUSENO', $warehouseNo)
    //         ->getData();

    //     $fieldName = null;
    //     if ($groupBy === "material") {
    //         $fieldName = "MATNR";
    //     }
    //     if ($groupBy === "batch") {
    //         $fieldName = "CHARG";
    //     }
    //     if ($groupBy === "expiry") {
    //         $fieldName = "VFDAT";
    //     }

    //     $utf8_data = $this->convert_latin1_to_utf8_recursive($result);
    //     $collection = collect($utf8_data["T_SCWM_AQUA"]);

    //     // Transform to collection and group the data that correspond from $groupBy
    //     if ($fieldName) {
    //         $newCollection = $collection->groupBy($fieldName)
    //              ->map(function ($group) use ($groupBy, $fieldName) {
    //                  $transformData =  [
    //                      'customerCode' => trim($group[0]["MATNR"]),
    //                      'description' => $group[0]["MAKTX"],
    //                      'quantity' =>  $group->sum('QUAN')
    //                  ];

    //                  if ($groupBy === "batch") {
    //                      $transformData['batch'] = $group[0][$fieldName];
    //                  }

    //                  if ($groupBy == "expiry") {
    //                      $transformData['expiry'] = $group[0][$fieldName];
    //                  }

    //                  return $transformData;
    //              })->all();
    //     } else {
    //         $newCollection = $collection->map(function ($data) {
    //             return [
    //                 'customerCode' => trim($data["MATNR"]),
    //                 'description' => $data["MAKTX"],
    //                 'quantity' =>  $data['QUAN'],
    //                 'batch' => $data['CHARG'],
    //                 'expiry' => $data['VFDAT']
    //             ];
    //         })->all();
    //     }


    //     return $newCollection;
    // }


    public function getStocksInventory($customerCode, $warehouseNo, $groupBy = "material")
    {
        $mandt = SapRfcFacade::getMandt();

        // Get Material no. and description
        $materialNo = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
                ->param('QUERY_TABLE', 'MAKT')
                ->param('DELIMITER', ';')
                ->param('OPTIONS', [
                    ['TEXT' => "MANDT = {$mandt}"],
                    ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
                ])
                ->param('FIELDS', [
                    ['FIELDNAME' => 'MATNR'],
                    ['FIELDNAME' => 'MAKTX'],
                ])
                ->getDataToArray();

        // Get material no., total available, allocated stocks,
        // blocked stocks, quarantined stocks and restricted stocks.
        $weightDetails = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
                ->param('QUERY_TABLE', 'MARD')
                ->param('DELIMITER', ';')
                ->param('OPTIONS', [
                    ['TEXT' => "MANDT = {$mandt}"],
                    ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
                    ['TEXT' => " AND WERKS EQ '{$warehouseNo}'"],
                    ['TEXT' => " AND (LABST > 0"],
                    ['TEXT' => " OR UMLME > 0"],
                    ['TEXT' => " OR INSME > 0"],
                    ['TEXT' => " OR SPEME > 0)"],
                ])
                ->param('FIELDS', [
                    ['FIELDNAME' => 'MATNR'],
                    ['FIELDNAME' => 'LABST'],
                    ['FIELDNAME' => 'UMLME'],
                    ['FIELDNAME' => 'INSME'],
                    ['FIELDNAME' => 'SPEME'],
                ])
                ->getDataToArray();

        $fixedWeight = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
                ->param('QUERY_TABLE', 'MARM')
                ->param('DELIMITER', ';')
                ->param('OPTIONS', [
                    ['TEXT' => "MANDT = {$mandt}"],
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


        $collectionMaterial = collect($materialNo);
        $collectionWeight = collect($weightDetails);
        $collectionFixedWeight = collect($fixedWeight);

        $keyedMaterial = $collectionMaterial->mapWithKeys(function ($item, $key) {
            return [
                $item['MATNR'] => [
                    'materialCode' => $item['MATNR'],
                    'description' => $item['MAKTX'],
                ]
            ];
        });

        $keyedStockWeight = $collectionWeight->mapWithKeys(function ($item, $key) {
            return [
                $item['MATNR'] => [
                    'availableWt' => (float)$item['LABST'],
                    'allocatedWt' => (float)$item['UMLME'],
                    'blockedWt' => (float)$item['INSME'],
                    'restrictedWt' => (float)$item['SPEME'],
                ]
            ];
        });

        $keyedFixedWeight = $collectionFixedWeight->mapWithKeys(function ($item, $key) {
            return [
                $item['MATNR'] => [
                    'unit' => $item['MEINH'],
                    'fixedWt' =>  (float)$item['UMREZ'] / (float)$item['UMREN'],
                ]
            ];
        });

        $mergedMaterialStocks = $keyedMaterial->mergeRecursive($keyedStockWeight);
        $merged = $mergedMaterialStocks->mergeRecursive($keyedFixedWeight)
                 ->filter(function ($data) {
                     // Return only data if anyone of the field below has value.
                     return (
                         array_key_exists('availableWt', $data)
                      || array_key_exists('allocatedWt', $data)
                      || array_key_exists('blockedWt', $data)
                      || array_key_exists('restrictedWt', $data)
                     );
                 })
                 ->map(function ($data) {
                     $fixedWeight = array_key_exists('fixedWt', $data) ? $data['fixedWt'] : 0;

                     // Calculate the quantity.
                     if ($fixedWeight > 0) {
                         $qty['availableQty'] = $data['availableWt'] / $fixedWeight;
                         $qty['allocatedQty'] = number_format($data['allocatedWt'] / $fixedWeight, 3);
                         $qty['blockedQty'] = $data['blockedWt'] / $fixedWeight;
                         $qty['restrictedQty'] = $data['restrictedWt'] / $fixedWeight;
                     } else {
                         $qty['availableQty'] = 0;
                         $qty['allocatedQty'] = 0;
                         $qty['blockedQty'] = 0;
                         $qty['restrictedQty'] = 0;
                     }
                     return array_merge($data, $qty);
                 })
                 ->all();
        $result = count($merged) > 0 ? array_values($merged) : [];

        return $result;
    }
}
