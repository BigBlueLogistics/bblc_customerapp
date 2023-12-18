<?php

namespace App\Repository;

use App\Facades\SapRfcFacade;
use App\Interfaces\IInventoryRepository;
use App\Traits\StringEncode;

class InventoryRepository implements IInventoryRepository
{
    use StringEncode;

    public function getAllocatedStocks($customerCode, $warehouseNo)
    {
        $mandt = SapRfcFacade::getMandt();
        $materials = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
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

        // Get the DOCCAT=PDO
        $warehouseNoFilter = $warehouseNo ? ["TEXT" => " AND LGNUM EQ '{$warehouseNo}'"] : [];
        $aqua = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
        ->param('QUERY_TABLE', '/SCWM/AQUA')
        ->param('DELIMITER', ';')
        ->param('OPTIONS', [
            ['TEXT' => "MANDT EQ {$mandt}"],
            ['TEXT' => " AND DOCCAT EQ 'PDO'"],
            $warehouseNoFilter,
        ])
        ->param('FIELDS', [
            ['FIELDNAME' => 'MATID'],
            ['FIELDNAME' => 'QUAN'],
            ['FIELDNAME' => 'VFDAT'],
            ['FIELDNAME' => 'CAT'],
            ['FIELDNAME' => 'HUIDENT'],
            ['FIELDNAME' => 'LGPLA'],
            ['FIELDNAME' => 'CHARG'],
        ])
        ->getDataToArray();

        $materials = collect($materials)->mapWithKeys(function($item){
            return [
                $item['GUID'] => $item['MATNR']
            ];
        })->toArray();

        // Check if MATID has match with GUID
        $aqua = collect($aqua)->groupBy('MATID')->filter(function($_, $key) use ($materials){
            return array_key_exists($key, $materials);
        })
        ->mapWithKeys(function($item, $key) use ($materials){
            return [
                $materials[$key] => [
                    'materialCode' => $materials[$key],
                    'initialAllocatedWt' => $item->sum("QUAN")
                ]
            ];
        });

        return $aqua->toArray() ?? [];
    }

    public function getStocksInventory($customerCode, $warehouseNo)
    {
        $mandt = SapRfcFacade::getMandt();

        if (strtolower($warehouseNo) == 'all') {
            $warehouseNo = '';
        } else {
            $warehouseNo = str_replace('BB', 'WH', $warehouseNo);
        }

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

        // Get picking products
        $ordim = SapRfcFacade::functionModule('ZFM_EWM_ORDIM')
            ->param('IV_MATNR', $customerCode)
            ->param('IV_TYPE', '') // X = ordim_c
            ->param('IV_PROCESS', '2010')
            ->param('IV_WAREHOUSE', $warehouseNo)
            ->param('IV_WAREHOUSE_ORD', '')
            // ->param('IV_ROWS', '');
            ->getData();

        // Get sales unit
        $salesUnit = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'MVKE')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ {$mandt}"],
                ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
                ['TEXT' => " AND VRKME NE ''"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'MATNR'],
                ['FIELDNAME' => 'VRKME'],
            ])
            ->getDataToArray();

        $utf8_data_ordim = $this->convert_latin1_to_utf8_recursive($ordim);

        $collectionProducts = collect($utf8_data['T_SCWM_AQUA']);
        $collectionFixedWt = collect($fixedWt);
        $collectionSalesUnit = collect($salesUnit);
        $collectionPicking = collect($utf8_data_ordim['T_SCWM_ORDIM']);

        $groupProductDetails = $collectionProducts->groupBy('MATNR')
            ->map(function ($group) {
                // // Add up initialAllocated, available and restricted
                // $initialAllocatedWt = $group->reduce(function ($total, $current) {
                //     if ($current['LGTYP'] === 'GIZN') {
                //         $total += (float) $current['QUAN'];
                //     }

                //     return $total;
                // }, 0);
                $restrictedWt = $group->reduce(function ($total, $current) {
                    if (in_array(strtoupper($current['CAT']), ['Q1', 'B1'])) {
                        $total += (float) $current['QUAN'];
                    }

                    return $total;
                }, 0);
                $availableWt = $group->reduce(function ($total, $current) {
                    if (! in_array(strtoupper($current['CAT']), ['Q1', 'B1']) && $current['LGTYP'] !== 'GIZN') {
                        $total += (float) $current['QUAN'];
                    }

                    return $total;
                }, 0);

                return [
                    'materialCode' => $group[0]['MATNR'],
                    'description' => $group[0]['MAKTX'],
                    // 'initialAllocatedWt' => round($initialAllocatedWt, 3),
                    'restrictedWt' => round($restrictedWt, 3),
                    'availableWt' => round($availableWt, 3),
                    'warehouse' => $group[0]['LGNUM'],
                ];
            });

        $keyedSalesUnit = $collectionSalesUnit->reduce(function ($carry, $item) {
            $prev = $carry ?? [];
            if (! array_key_exists($item['MATNR'], $prev)) {
                $prev[$item['MATNR']]['unit'] = $item['VRKME'];
            }

            return $prev;
        });

        $keyedFixedWt = $collectionFixedWt->reduce(function ($carry, $item) use ($keyedSalesUnit) {
            $prev = $carry ?? [];

            if (! array_key_exists($item['MATNR'], $prev)) {

                // Material no. exists in sales unit.
                if (array_key_exists($item['MATNR'], $keyedSalesUnit)) {
                    $salesUnit = $keyedSalesUnit[$item['MATNR']]['unit'];

                    // MEINH match in sales unit compute the fixed weight
                    if ($salesUnit === $item['MEINH']) {
                        $prev[$item['MATNR']]['unit'] = $salesUnit;
                        $prev[$item['MATNR']]['fixedWt'] = (float) $item['UMREZ'] / (float) $item['UMREN'];
                    }
                } else {
                    $prev[$item['MATNR']]['unit'] = is_null($item['MEINH']) ? 'KG' : $item['MEINH'];
                    $prev[$item['MATNR']]['fixedWt'] = is_null($item['UMREZ']) ? 1 : (float) $item['UMREZ'] / (float) $item['UMREN'];
                }
            }

            return $prev;
        }, []);

        // Add up vsolm
        $totalVsolmWt = $collectionPicking->mapToGroups(function ($item) {
            return [
                $item['MATNR'] => [
                    'totalVsolmWt' => $item['VSOLM'],
                ],
            ];
        })->map(function ($item) {
            $totalVsolm = $item->reduce(function ($total, $current) {
                $total += (float) $current['totalVsolmWt'];

                return $total;
            });

            return [
                'totalVsolmWt' => round($totalVsolm, 3),
            ];
        });

        $allocatedStocks = $this->getAllocatedStocks($customerCode, $warehouseNo);

        $mergedProducts = $groupProductDetails->mergeRecursive($keyedFixedWt);
        $merged = $mergedProducts->mergeRecursive($totalVsolmWt)
            ->filter(function ($data) {
                // Return only data if anyone of the field below has value.
                return
                    (array_key_exists('availableWt', $data)
                 || array_key_exists('restrictedWt', $data)
                //  || array_key_exists('initialAllocatedWt', $data)
                 || array_key_exists('totalVsolmWt', $data))
                 && array_key_exists('materialCode', $data);
            })
            ->map(function ($data) use ($allocatedStocks) {
                $materialCode = $data['materialCode'];
                $fixedWt = array_key_exists('fixedWt', $data) ? $data['fixedWt'] : 1;
                $restrictedWt = array_key_exists('restrictedWt', $data) && $data['restrictedWt'] > 0 ? $data['restrictedWt'] : 0;
                $initialAllocatedWt = count($allocatedStocks) 
                            && array_key_exists($materialCode, $allocatedStocks)
                            && $allocatedStocks[$materialCode]['initialAllocatedWt'] > 0
                                ? $allocatedStocks[$materialCode]['initialAllocatedWt'] : 0 ;
                // $initialAllocatedWt = array_key_exists('initialAllocatedWt', $data) ? $data['initialAllocatedWt'] : 0;
                $availableWt = array_key_exists('availableWt', $data) && $data['availableWt'] > 0 ? $data['availableWt'] : 0;
                $totalVsolmWt = array_key_exists('totalVsolmWt', $data) && $data['totalVsolmWt'] > 0 ? $data['totalVsolmWt'] : 0;
                $unit = array_key_exists('unit', $data) ? $data['unit'] : 'KG';
                $warehouse = array_key_exists('warehouse', $data) ? $data['warehouse'] : '';
                $newAvailableWt = $availableWt - $initialAllocatedWt;
                $allocatedWt = $initialAllocatedWt + $totalVsolmWt;

                // Calculate the quantity.
                $availableQty = $newAvailableWt / $fixedWt;
                $allocatedQty = $allocatedWt / $fixedWt;
                $restrictedQty = $restrictedWt / $fixedWt;

                // Quantity
                $res['availableQty'] = round(max($availableQty, 0), 3);
                $res['allocatedQty'] = round(max($allocatedQty, 0), 3);
                $res['restrictedQty'] = round(max($restrictedQty, 0), 3);
                $res['totalQty'] = round(max($availableQty + $allocatedQty + $restrictedQty, 0), 3);

                // Weight
                $res['availableWt'] = round(max($newAvailableWt, 0), 3);
                $res['allocatedWt'] = round(max($allocatedWt, 0), 3);
                $res['restrictedWt'] = round(max($restrictedWt, 0), 3);
                $res['fixedWt'] = $fixedWt.' / '.$unit;
                $res['warehouse'] = $warehouse;

                return array_merge($data, $res);
            })
            ->all();
        $result = count($merged) > 0 ? array_values($merged) : [];

        return $result;
    }
}
