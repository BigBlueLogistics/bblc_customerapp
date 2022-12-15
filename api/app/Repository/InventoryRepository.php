<?php

namespace App\Repository;

use App\Facades\SapRfcFacade;
use App\Interfaces\IInventoryRepository;
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

        // Get picking products
        $ordim = SapRfcFacade::functionModule('ZFM_EWM_ORDIM')
            ->param('IV_MATNR', $customerCode)
            ->param('IV_TYPE', '') // X = ordim_c
            ->param('IV_PROCESS', '2010')
            ->param('IV_WAREHOUSE', $warehouseNo)
            ->param('IV_WAREHOUSE_ORD', '')
            // ->param('IV_ROWS', '');
        ->getData();

        $utf8_data_ordim = $this->convert_latin1_to_utf8_recursive($ordim);

        $collectionProducts = collect($utf8_data['T_SCWM_AQUA']);
        $collectionFixedWt = collect($fixedWt);
        $collectionPicking = collect($utf8_data_ordim['T_SCWM_ORDIM']);

        $groupProductDetails = $collectionProducts->groupBy('MATNR')
                ->map(function ($group) {
                    // Add up initialAllocated, available and restricted
                    $initialAllocatedWt = $group->reduce(function ($total, $current) {
                        if ($current['LGTYP'] === 'GIZN') {
                            $total += (float) $current['QUAN'];
                        }

                        return $total;
                    }, 0);
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
                        'initialAllocatedWt' => round($initialAllocatedWt, 3),
                        'restrictedWt' => round($restrictedWt, 3),
                        'availableWt' => round($availableWt, 3),
                    ];
                });

        $keyedFixedWt = $collectionFixedWt->mapWithKeys(function ($item) {
            return [
                $item['MATNR'] => [
                    'unit' => is_null($item['MEINH']) ? 'KG' : $item['MEINH'],
                    'fixedWt' => is_null($item['UMREZ']) ? 1 : (float) $item['UMREZ'] / (float) $item['UMREN'],
                ],
            ];
        });

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

        $mergedProducts = $groupProductDetails->mergeRecursive($keyedFixedWt);
        $merged = $mergedProducts->mergeRecursive($totalVsolmWt)
                        ->filter(function ($data) {
                            // Return only data if anyone of the field below has value.
                            return
                                (array_key_exists('availableWt', $data)
                             || array_key_exists('restrictedWt', $data)
                             || array_key_exists('initialAllocatedWt', $data)
                             || array_key_exists('totalVsolmWt', $data))
                             && array_key_exists('materialCode', $data);
                        })
                        ->map(function ($data) {
                            $fixedWt = array_key_exists('fixedWt', $data) ? $data['fixedWt'] : 1;
                            $availableWt = array_key_exists('availableWt', $data) ? $data['availableWt'] : 0;
                            $restrictedWt = array_key_exists('restrictedWt', $data) ? $data['restrictedWt'] : 0;
                            $initialAllocatedWt = array_key_exists('initialAllocatedWt', $data) ? $data['initialAllocatedWt'] : 0;
                            $totalVsolmWt = array_key_exists('totalVsolmWt', $data) ? $data['totalVsolmWt'] : 0;
                            $unit = array_key_exists('unit', $data) ? $data['unit'] : 'KG';
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
                            $res['fixedWt'] = $fixedWt;
                            $res['unit'] = $unit;

                            return array_merge($data, $res);
                        })
                        ->all();
        $result = count($merged) > 0 ? array_values($merged) : [];

        return $result;
    }
}
