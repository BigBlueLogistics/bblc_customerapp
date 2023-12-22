<?php

namespace App\Repository;

use App\Facades\SapRfcFacade;
use App\Interfaces\IReportsRepository;
use App\Traits\StringEncode;
use Carbon\Carbon;
use DB;

class ReportsRepository implements IReportsRepository
{
    use StringEncode;

    public function getWhSnapshot($customerCode, $warehouseNo, $groupBy)
    {
        $mandt = SapRfcFacade::getMandt();
        $warehouseNo = str_replace('BB', 'WH', $warehouseNo);

        // Get Material no. and description, available,
        // allocated and restricted stocks
        $stocks = SapRfcFacade::functionModule('ZFM_EWM_TABLEREAD')
            ->param('IV_CUSTOMER', $customerCode)
            ->param('IV_WAREHOUSENO', $warehouseNo)
            ->getData();

        $utf8_stocks = $this->convert_latin1_to_utf8_recursive($stocks);

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

        $utf8_ordim = $this->convert_latin1_to_utf8_recursive($ordim);

        $collectionProducts = collect($utf8_stocks['T_SCWM_AQUA']);
        $collectionFixedWt = collect($fixedWt);
        $collectionSalesUnit = collect($salesUnit);
        $collectionPicking = collect($utf8_ordim['T_SCWM_ORDIM']);

        $fieldName = null;
        if ($groupBy === 'batch') {
            $fieldName = 'CHARG';
        } elseif ($groupBy === 'expiry') {
            $fieldName = 'VFDAT';
        } else {
            $fieldName = 'MATNR';
        }

        // Add up initialAllocated, available and restricted
        $groupProductDetails = $collectionProducts->groupBy($fieldName)
            ->map(function ($group) use ($groupBy, $fieldName) {
                $availableWt = $group->reduce(function ($total, $current) {
                    if (in_array(strtoupper($current['CAT']), ['F1']) 
                        && array_key_exists('DOCCAT', $current) 
                        && $current['DOCCAT'] === "") 
                    {
                        $total += (float) $current['QUAN'];
                    }

                    return $total;
                }, 0);
                $restrictedWt = $group->reduce(function ($total, $current) {
                    if (in_array(strtoupper($current['CAT']), ['B1', 'R1', 'Q1'])) {
                        $total += (float) $current['QUAN'];
                    }

                    return $total;
                }, 0);
                $initialAllocatedWt = $group->reduce(function ($total, $current) {
                    if (array_key_exists('DOCCAT', $current) && $current['DOCCAT'] !== '') {
                        $total += (float) $current['QUAN'];
                    }

                    return $total;
                }, 0);

                $transformData = [
                    'materialCode' => $group[0]['MATNR'],
                    'description' => $group[0]['MAKTX'],
                    'initialAllocatedWt' => round($initialAllocatedWt, 3),
                    'restrictedWt' => round($restrictedWt, 3),
                    'availableWt' => round($availableWt, 3),
                ];

                if ($groupBy === 'batch') {
                    $transformData['batch'] = $group[0][$fieldName];
                }
                if ($groupBy == 'expiry') {
                    $transformData['expiry'] = Carbon::parse($group[0][$fieldName])->format('m/d/Y');
                }

                return $transformData;
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

        // Add up vsolm means for picking.
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
        })->toArray();


        $merged = $groupProductDetails->filter(function ($data) {
            // Return only data if anyone of the field below has value.
            return
                (array_key_exists('availableWt', $data) 
                            || array_key_exists('restrictedWt', $data)
                            || array_key_exists('initialAllocatedWt', $data))
                            && array_key_exists('materialCode', $data);
        })
            ->map(function ($data) use ($keyedFixedWt, $totalVsolmWt) {
                $materialCode = $data['materialCode'];
                $fixedWt = $keyedFixedWt[$materialCode]['fixedWt'] ?? 1;
                $unit = $keyedFixedWt[$materialCode]['unit'] ?? 'KG';
                $totalVsolmWt = array_key_exists($materialCode, $totalVsolmWt) 
                        && $totalVsolmWt[$materialCode]['totalVsolmWt'] > 0
                            ? $totalVsolmWt[$materialCode]['totalVsolmWt'] : 0;
                $restrictedWt = array_key_exists('restrictedWt', $data) && $data['restrictedWt'] > 0 ? $data['restrictedWt'] : 0;
                $initialAllocatedWt = array_key_exists('initialAllocatedWt', $data) && $data['initialAllocatedWt'] > 0 ? $data['initialAllocatedWt'] : 0;
                $availableWt = array_key_exists('availableWt', $data) && $data['availableWt'] > 0 ? $data['availableWt']  : 0;
                $allocatedWt = $initialAllocatedWt + $totalVsolmWt;

                // Calculate the quantity.
                $availableQty = $availableWt / $fixedWt;
                $allocatedQty = $allocatedWt / $fixedWt;
                $restrictedQty = $restrictedWt / $fixedWt;

                // Quantity
                $res['availableQty'] = round(max($availableQty, 0), 3);
                $res['allocatedQty'] = round(max($allocatedQty, 0), 3);
                $res['restrictedQty'] = round(max($restrictedQty, 0), 3);
                $res['totalQty'] = round(max($availableQty + $allocatedQty + $restrictedQty, 0), 3);

                // Weight
                $res['availableWt'] = round(max($availableWt, 0), 3);
                $res['allocatedWt'] = round(max($allocatedWt, 0), 3);
                $res['restrictedWt'] = round(max($restrictedWt, 0), 3);
                $res['fixedWt'] = $fixedWt.' / '.$unit;

                return array_merge($data, $res);
            })
            ->all();

        $result = count($merged) > 0 ? array_values($merged) : [];

        return $result;
    }

    // WIP
    public function getStocks($customerCode, $warehouseNo, $startDate, $endDate)
    {
        $warehouseNo = str_replace('BB', 'WH', $warehouseNo);
        $mandt = SapRfcFacade::getMandt();
        $result = null;

        $ndb = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
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

        $mard = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'MARD')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ {$mandt}"],
                ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
                ['TEXT' => " AND WERKS EQ '{$warehouseNo}'"],
                ['TEXT' => ' AND ( LABST > 0 '],
                ['TEXT' => ' OR INSME > 0 '],
                ['TEXT' => ' OR SPEME > 0 )'],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'MATNR'],
                ['FIELDNAME' => 'LABST'],
                ['FIELDNAME' => 'UMLME'],
                ['FIELDNAME' => 'INSME'],
            ])
            ->getDataToArray();

        $marm = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'MARM')
            ->param('DELIMITER', ';')
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

        $makt = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
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

        $likp = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'LIKP')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ '{$mandt}'"],
                ['TEXT' => " AND KUNAG EQ '{$customerCode}'"],
                ['TEXT' => " AND ERDAT >= '{$startDate}'"],
                ['TEXT' => " AND ERDAT <= '{$endDate}'"],

            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'VBELN'],
            ])
            ->getDataToArray();

        $result['ndb'] = $ndb;
        $result['maktx'] = $makt;
        $result['mard'] = $mard;
        $result['marm'] = $marm;
        $result['likp'] = $likp;

        if (count($likp)) {
            $arrWho = null;
            foreach ($likp as $value) {
                $vbeln = $value['VBELN'];
                $refDoc = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
                    ->param('QUERY_TABLE', '/SCDL/DB_REFDOC')
                    ->param('DELIMITER', ';')
                    ->param('ROWCOUNT', 1)
                    ->param('OPTIONS', [
                        ['TEXT' => "MANDT EQ '{$mandt}'"],
                        ['TEXT' => " AND REFDOCNO EQ '{$vbeln}'"],
                        ['TEXT' => " AND REFDOCCAT EQ 'ERP'"],
                    ])
                    ->param('FIELDS', [
                        ['FIELDNAME' => 'DOCID'],
                    ])
                    ->getDataToArray();
                $docId = $refDoc[0]['DOCID'];

                $whoByDocId = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
                    ->param('QUERY_TABLE', '/SCWM/ORDIM_C')
                    ->param('DELIMITER', ';')
                    ->param('OPTIONS', [
                        ['TEXT' => "MANDT EQ '{$mandt}'"],
                        ['TEXT' => " AND RDOCID EQ '{$docId}'"],

                    ])
                    ->param('FIELDS', [
                        ['FIELDNAME' => 'WHO'],
                    ])
                    ->getDataToArray();

                $arrWho[] = $whoByDocId;
            }

            $uniqueWho = collect($arrWho)
                ->flatten()
                ->unique()
                ->values()
                ->all();

            $ordim = collect($uniqueWho)
                ->map(function ($who) {
                    return SapRfcFacade::functionModule('ZFM_EWM_ORDIM')
                        ->param('IV_MATNR', '')
                        ->param('IV_TYPE', 'X') // X = ordim_c
                        ->param('IV_PROCESS', '')
                        ->param('IV_WAREHOUSE', '')
                        ->param('IV_WAREHOUSE_ORD', $who)
                        // ->param('IV_ROWS', '')
                        ->getDataToArray();
                });

            $result['ordim_c'] = $ordim;
        }

        return $result;
    }

    public function agingBy($customerCode, $warehouseNo, $fieldName)
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

        // Get picking products
        $ordim = SapRfcFacade::functionModule('ZFM_EWM_ORDIM')
            ->param('IV_MATNR', $customerCode)
            ->param('IV_TYPE', '') // X = ordim_c
            ->param('IV_PROCESS', '2010')
            ->param('IV_WAREHOUSE', $warehouseNo)
            ->param('IV_WAREHOUSE_ORD', '')
            // ->param('IV_ROWS', '');
            ->getData();

        $utf8_ordim = $this->convert_latin1_to_utf8_recursive($ordim);

        $collectionFixedWt = collect($fixedWt);
        $collectionSalesUnit = collect($salesUnit);
        $collectionProducts = collect($utf8_data['T_SCWM_AQUA'])
            ->map(function ($value) {
                return [
                    'MATNR' => $value['MATNR'],
                    'VFDAT' => $value['VFDAT'],
                    'QUAN' => $value['QUAN'],
                    'WDATU' => $value['WDATU'],
                    'MAKTX' => $value['MAKTX'],
                ];
            })->groupBy('MATNR')->ToArray();

        $collectionPicking = collect($utf8_ordim['T_SCWM_ORDIM'])
            ->map(function ($value) {
                // Rename VSOLM to QUAN to able merge in $collectionProducts
                return [
                    'MATNR' => $value['MATNR'],
                    'VFDAT' => $value['VFDAT'],
                    'QUAN' => $value['VSOLM'],
                    'WDATU' => $value['WDATU'],
                    'MAKTX' => '',
                ];
            })->groupBy('MATNR')->ToArray();

        $mergedProducts = array_merge_recursive($collectionProducts, $collectionPicking);

        $today = Carbon::today();
        $groupProductDetails = collect($mergedProducts)->map(function ($group) use ($today, $fieldName) {
            $qty_gt_120 = 0;
            $qty_gt_60 = 0;
            $qty_gt_30 = 0;
            $qty_gt_15 = 0;
            $qty_lt_15 = 0;
            $qty_expired = 0;
            foreach ($group as $value) {
                $expiryDate = Carbon::parse($value[$fieldName]);
                $agingDays = $today->diffInDays($expiryDate, false);

                // > 120 days
                if ($agingDays > 120) {
                    $qty_gt_120 += (float) $value['QUAN'];
                }
                // > 60 days
                elseif ($agingDays < 120 && $agingDays > 60) {
                    $qty_gt_60 += (float) $value['QUAN'];
                }
                // > 30 days
                elseif ($agingDays < 60 && $agingDays > 30) {
                    $qty_gt_30 += (float) $value['QUAN'];
                }
                // > 15 days
                elseif ($agingDays < 30 && $agingDays > 15) {
                    $qty_gt_15 += (float) $value['QUAN'];
                }
                // < 15 days
                elseif ($agingDays < 15 && $agingDays > 0) {
                    $qty_lt_15 += (float) $value['QUAN'];
                }
                // expired
                else {
                    $qty_expired += (float) $value['QUAN'];
                }
            }

            return [
                'materialCode' => $group[0]['MATNR'],
                'description' => $group[0]['MAKTX'],
                'qty_exp_120' => round($qty_gt_120, 3),
                'qty_exp_60' => round($qty_gt_60, 3),
                'qty_exp_30' => round($qty_gt_30, 3),
                'qty_exp_15' => round($qty_gt_15, 3),
                'qty_exp_0' => round($qty_lt_15, 3),
                'qty_expired' => round($qty_expired, 3),
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

        $mergedProducts = $groupProductDetails->mergeRecursive($keyedFixedWt)
            ->filter(function ($arrData) {
                return array_key_exists('materialCode', $arrData);
            })
            ->map(function ($data) {
                $fixedWt = array_key_exists('fixedWt', $data) ? $data['fixedWt'] : 1;
                $unit = array_key_exists('unit', $data) ? $data['unit'] : 'KG';

                $qty_exp_120 = $data['qty_exp_120'] ?? 0;
                $qty_exp_60 = $data['qty_exp_60'] ?? 0;
                $qty_exp_30 = $data['qty_exp_30'] ?? 0;
                $qty_exp_15 = $data['qty_exp_15'] ?? 0;
                $qty_exp_0 = $data['qty_exp_0'] ?? 0;
                $qty_expired = $data['qty_expired'] ?? 0;

                $total = ($qty_exp_120
                + $qty_exp_60
                + $qty_exp_30
                + $qty_exp_15
                + $qty_exp_0
                + $qty_expired);

                return [
                    ...$data,
                    'fixedWt' => $fixedWt.' / '.$unit,
                    'totalQty' => round($total, 3),
                ];
            })
            ->all();
        $result = count($mergedProducts) > 0 ? array_values($mergedProducts) : [];

        return $result;
    }

    public function getAging($customerCode, $warehouseNo, $groupBy)
    {
        if ($groupBy == 'expiration') {
            return $this->agingBy($customerCode, $warehouseNo, 'VFDAT');
        } elseif ($groupBy == 'receiving') {
            return $this->agingBy($customerCode, $warehouseNo, 'WDATU');
        } else {
            return [];
        }
    }

    public function scheduleInventory($customerCode, $freqy, $invty1, $invty2, $invty3, $time1, $time2, $time3)
    {
        // If customerCode is exists update the row else insert the data.
        $upSert = DB::connection('wms')->table('KNA1')->updateOrInsert(
            ['KUNNR' => $customerCode],
            [
                'DAYIND' => $freqy,
                'INVTYP1' => $invty1,
                'INVTYP2' => $invty2,
                'INVTYP3' => $invty3,
                'TIMIND' => $time1,
                'TIMIN2' => $time2,
                'TIMIN3' => $time3,
            ]
        );

        return $upSert;
    }
}
