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


        // Get product id
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

        $collectionProducts = collect($utf8_data["T_SCWM_AQUA"]);
        $collectionFixedWt = collect($fixedWt);
        $collectionPicking = collect($productIds);

        $groupProductDetails = $collectionProducts->groupBy('MATNR')
                ->map(function ($group) {
                    // Add up initialAllocated, available and restricted
                    $initialAllocatedWt = $group->reduce(function ($total, $current) {
                        if ($current['LGTYP'] === 'GIZN') {
                            $total += (float)$current['QUAN'];
                        }
                        return $total;
                    }, 0);
                    $restrictedWt = $group->reduce(function ($total, $current) {
                        if (in_array(strtoupper($current['CAT']), ['Q1','B1'])) {
                            $total += (float)$current['QUAN'];
                        }
                        return $total;
                    }, 0);
                    $availableWt = $group->reduce(function ($total, $current) {
                        if (!in_array(strtoupper($current['CAT']), ['Q1','B1']) && $current['LGTYP'] !== 'GIZN') {
                            $total += (float)$current['QUAN'];
                        }
                        return $total;
                    }, 0);

                    return [
                        'materialCode' => $group[0]['MATNR'],
                        'description' => $group[0]['MAKTX'],
                        'initialAllocatedWt' => round($initialAllocatedWt, 3),
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

        // Get vsolm
        $keyedPicking = $collectionPicking->map(function ($item, $key) use ($mandt, $warehouseNo) {
            $guid =  $item['GUID'];
            $matnr = $item['MATNR'];

            $vsolm = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
                ->param('QUERY_TABLE', '/SCWM/ORDIM_O')
                ->param('DELIMITER', ';')
                ->param('OPTIONS', [
                    ['TEXT' => "MANDT EQ {$mandt}"],
                    ['TEXT' => " AND LGNUM EQ '{$warehouseNo}'"],
                    ['TEXT' => " AND MATID EQ '{$guid}'"],
                    ['TEXT' => " AND PROCTY EQ '2010'"],
                ])
                ->param('FIELDS', [
                    ['FIELDNAME' => 'VSOLM'],
                ])
                ->getDataToArray();

            if (count($vsolm)) {
                $vsolm = array_map(function ($value) use ($matnr) {
                    $value['MATNR'] = $matnr;
                    return $value;
                }, $vsolm);
            }

            return $vsolm;
        })->filter(function ($values) {
            return count($values) > 0;
        })->flatMap(function ($values) {
            return $values;
        });

        // Add up vsolm
        $totalVsolmWt = $keyedPicking->mapToGroups(function ($item) {
            return [
                $item['MATNR'] =>  [
                    'totalVsolmWt' => $item['VSOLM']
                ]
            ];
        })->map(function ($item) {
            $totalVsolm = $item->reduce(function ($total, $current) {
                $total += (float)$current['totalVsolmWt'];
                return $total;
            });

            return [
                'totalVsolmWt' => round($totalVsolm, 3)
            ];
        });


        $mergedProducts = $groupProductDetails->mergeRecursive($keyedFixedWt);
        $merged = $mergedProducts->mergeRecursive($totalVsolmWt)
                        ->filter(function ($data) {
                            // Return only data if anyone of the field below has value.
                            return (
                                (array_key_exists('availableWt', $data)
                             || array_key_exists('restrictedWt', $data)
                             || array_key_exists('initialAllocatedWt', $data)
                             || array_key_exists('totalVsolmWt', $data))
                             && array_key_exists('materialCode', $data)
                            );
                        })
                        ->map(function ($data) {
                            $fixedWt = array_key_exists('fixedWt', $data) ? $data['fixedWt'] : 1;
                            $availableWt = array_key_exists('availableWt', $data) ? $data['availableWt'] : 0;
                            $restrictedWt = array_key_exists('restrictedWt', $data) ? $data['restrictedWt'] : 0;
                            $initialAllocatedWt = array_key_exists('initialAllocatedWt', $data) ? $data['initialAllocatedWt'] : 0;
                            $totalVsolmWt = array_key_exists('totalVsolmWt', $data) ? $data['totalVsolmWt'] : 0;
                            $allocatedWt = $initialAllocatedWt + $totalVsolmWt;

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
        $result = count($merged) > 0 ? array_values($merged) : [];

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
