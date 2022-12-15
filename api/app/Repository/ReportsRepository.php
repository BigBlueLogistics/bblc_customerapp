<?php

namespace App\Repository;

use App\Facades\SapRfcFacade;
use App\Interfaces\IReportsRepository;
use App\Traits\StringEncode;

class ReportsRepository implements IReportsRepository
{
    use StringEncode;

    public function getWhSnapshot($customerCode, $warehouseNo, $groupBy)
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
                    $initialAllocatedWt = $group->reduce(function ($total, $current) {
                        if ($current['LGTYP'] === 'GIZN') {
                            $total += (float) $current['QUAN'];
                        }

                        return $total;
                    }, 0);
                    $restrictedWt = $group->reduce(function ($total, $current) {
                        if (in_array(strtoupper($current['CAT']), ['Q1', 'B1']) && $current['LGTYP'] !== 'GIZN') {
                            $total += (float) $current['QUAN'];
                        }

                        return $total;
                    }, 0);
                    $availableWt = $group->reduce(function ($total, $current) {
                        if (in_array(strtoupper($current['CAT']), ['F1']) && $current['LGTYP'] !== 'GIZN') {
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
                        $transformData['expiry'] = $group[0][$fieldName];
                    }

                    return $transformData;
                });

        // Fixed weight and unit.
        $keyedFixedWt = $collectionFixedWt->mapWithKeys(function ($item) {
            return [
                $item['MATNR'] => [
                    'unit' => is_null($item['MEINH']) ? 'KG' : $item['MEINH'],
                    'fixedWt' => is_null($item['UMREZ']) ? 1 : (float) $item['UMREZ'] / (float) $item['UMREN'],
                ],
            ];
        });

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
        });

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
                    $totalVsolmWt = $totalVsolmWt[$materialCode]['totalVsolmWt'] ?? 0;

                    $availableWt = array_key_exists('availableWt', $data) ? $data['availableWt'] : 0;
                    $restrictedWt = array_key_exists('restrictedWt', $data) ? $data['restrictedWt'] : 0;
                    $initialAllocatedWt = array_key_exists('initialAllocatedWt', $data) ? $data['initialAllocatedWt'] : 0;
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

    public function getAging($customerCode, $warehouseNo)
    {
    }

    public function getVbeln($vbeln, $warehouseNo)
    {
        $mandt = SapRfcFacade::getMandt();

        $refDoc = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', '/SDCL/DB_REFDOC')
            ->param('DELIMITER', ';')
            ->param('ROWCOUNT', 1)
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ {$mandt}"],
                ['TEXT' => " AND REFDOCNO EQ '{$vbeln}'"],
                ['TEXT' => " AND REFDOCCAT EQ 'ERP'"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'DOCID'],
            ])
            ->getDataToArray();
        $docId = $refDoc[0]['DOCID'];

        $rowsLikp = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'LIKP')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ {$mandt}"],
                ['TEXT' => "AND LGNUM EQ {$warehouseNo}"],
                ['TEXT' => "AND RDOCCID EQ {$docId}"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'MATID'],
                ['FIELDNAME' => 'CHARG'],
                ['FIELDNAME' => 'VFDAT'],
                ['FIELDNAME' => 'VSOLM'],
                ['FIELDNAME' => 'PROCTY'],
            ])
            ->getDataToArray();

        return $rowsLikp;
    }
}
