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
                    ['TEXT' => "MANDT EQ {$mandt}"],
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
                    ['TEXT' => "MANDT EQ {$mandt}"],
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

        $productIds = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
                ->param('QUERY_TABLE', 'NDBSMATG16')
                ->param('DELIMITER', ';')
                ->param('OPTIONS', [
                    ['TEXT' => "MANDT EQ {$mandt}"],
                    ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
                ])
                ->param('FIELDS', [
                    ['FIELDNAME' => 'MATNR'],
                    ['FIELDNAME' => 'GUID'],
                ])
                ->getDataToArray();


        $collectionPicking = collect($productIds)->map(function ($item, $key) use ($mandt, $warehouseNo) {
            $guid =  $item['GUID'];
            $matnr = $item['MATNR'];
            $replaceWh = str_replace('BB', 'WH', $warehouseNo);

            $picking = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
                ->param('QUERY_TABLE', '/SCWM/ORDIM_O')
                ->param('DELIMITER', ';')
                ->param('OPTIONS', [
                    ['TEXT' => "MANDT EQ {$mandt}"],
                    ['TEXT' => " AND LGNUM EQ '{$replaceWh}'"],
                    ['TEXT' => " AND MATID EQ '{$guid}'"],
                    ['TEXT' => " AND PROCTY EQ '2010'"],
                ])
                ->param('FIELDS', [
                    ['FIELDNAME' => 'VSOLM'],
                    ['FIELDNAME' => 'CHARG'],
                    ['FIELDNAME' => 'VFDAT'],
                    ['FIELDNAME' => 'VLPLA'],
                    ['FIELDNAME' => 'VLTYP'],
                    ['FIELDNAME' => 'VLENR'],
                ])
                ->getDataToArray();

            if (count($picking)) {
                $picking = array_map(function ($value) use ($matnr) {
                    $value['MATNR'] = $matnr;
                    return $value;
                }, $picking);
            }

            return $picking;
        })->filter(function ($values) {
            return count($values) > 0;
        })->flatMap(function ($values) {
            return $values;
        });

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

        $keyedStockWt = $collectionWeight->mapWithKeys(function ($item) {
            return [
                $item['MATNR'] => [
                    'availableWt' => (float)$item['LABST'],
                    // 'allocatedWt' => (float)$item['UMLME'],
                    'blockedWt' => (float)$item['INSME'],
                    'restrictedWt' => (float)$item['SPEME'],
                ]
            ];
        });

        $keyedFixedWt = $collectionFixedWeight->mapWithKeys(function ($item) {
            return [
                $item['MATNR'] => [
                    'unit' => is_null($item['MEINH']) ? "KG" : $item['MEINH'],
                    'fixedWt' =>  is_null($item['UMREZ']) ? 1.000 : (float)$item['UMREZ'] / (float)$item['UMREN'],
                ]
            ];
        });

        $keyedPicking = $collectionPicking->mapToGroups(function ($item) {
            return [
                $item['MATNR'] =>  [
                    'allocatedWt' => $item['VSOLM']
                ]
            ];
        })->map(function ($item) {
            $totalVsolm = $item->reduce(function ($total, $current) {
                $total += (float)$current['allocatedWt'];
                return $total;
            });

            return [
                'allocatedWt' => $totalVsolm
            ];
        });

        $mergedMaterialStocks = $keyedMaterial->mergeRecursive($keyedStockWt);
        $mergedFixedWt = $mergedMaterialStocks->mergeRecursive($keyedFixedWt);
        $merged = $mergedFixedWt->mergeRecursive($keyedPicking)
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
                     $fixedWeight = array_key_exists('fixedWt', $data) ? $data['fixedWt'] : 1;
                     $allocatedWt = array_key_exists('allocatedWt', $data) ? $data['allocatedWt'] : 0;

                     // Calculate the quantity.
                     $res['availableQty'] = $data['availableWt'] / $fixedWeight;
                     $res['allocatedQty'] = $allocatedWt / $fixedWeight;
                     $res['blockedQty'] = $data['blockedWt'] / $fixedWeight;
                     $res['restrictedQty'] = $data['restrictedWt'] / $fixedWeight;

                     // Weight
                     $res['allocatedWt'] = $allocatedWt;

                     return array_merge($data, $res);
                 })
                 ->all();
        $result = count($merged) > 0 ? array_values($merged) : [];

        return $result;
    }
}
