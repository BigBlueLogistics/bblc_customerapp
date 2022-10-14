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
        $stockDetails = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
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

        $collectionMaterial = collect($materialNo);
        $collectionStocks = collect($stockDetails);

        $keyedMaterial = $collectionMaterial->mapWithKeys(function ($item, $key) {
            return [
                $item['MATNR'] => [
                    'materialCode' => $item['MATNR'],
                    'description' => $item['MAKTX'],
                ]
            ];
        });

        $keyedStocks = $collectionStocks->mapWithKeys(function ($item, $key) {
            return [
                $item['MATNR'] => [
                    'totalAvailable' => $item['LABST'],
                    'allocatedStocks' => $item['UMLME'],
                    'blockedStocks' => $item['INSME'],
                    'restrictedStocks' => $item['SPEME'],
                ]
            ];
        });

        $merged = $keyedMaterial->mergeRecursive($keyedStocks)->all();
        $result = count($merged) > 0 ? array_values($merged) : [];

        return $result;
    }
}
