<?php

namespace App\Repository;

use App\Facades\SapRfcFacade;
use App\Interfaces\IIndicatorsRepository;
use Carbon\Carbon;

class IndicatorsRepository implements IIndicatorsRepository
{
    public function getInboundOutboundWt($customerCode)
    {
        $mandt = SapRfcFacade::getMandt();

        $fromDate = Carbon::today()->subMonth()->format('Ymd');
        $toDate = Carbon::today()->format('Ymd');

        $lips = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'LIPS')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ {$mandt}"],
                ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
                ['TEXT' => " AND (ERDAT GE '{$fromDate}'"],
                ['TEXT' => " AND ERDAT LE '{$toDate}')"],
                ['TEXT' => " AND CHARG NE ''"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'ERDAT'],
                ['FIELDNAME' => 'BWART'],
                ['FIELDNAME' => 'BRGEW'],
                ['FIELDNAME' => 'VBELN'],
            ])
            ->getDataToArray();

        $collectionWt = collect($lips)
            ->values()
            ->map(function ($item) {
                //get type
                if (trim($item['BWART']) == '501') {
                    $type = 'INBOUND';
                } else {
                    $type = 'OUTBOUND';
                }

                return [
                    'type' => $type,
                    'date' => $item['ERDAT'],
                    'weight' => $item['BRGEW'],
                ];
            });

        $wtGroupByDate = $collectionWt->groupBy('type');
        $wtDates = $collectionWt->unique('date')->pluck('date')
            ->sort()
            ->map(function ($item) {
                $formatDate = Carbon::parse($item)->format('M. d');

                return $formatDate;
            })
            ->values();

        if ($wtGroupByDate->has('INBOUND')) {
            $inboundArr = $wtGroupByDate->only(['INBOUND']);

            // Add up Inbound weight by daily
            $totalWtInbound = $inboundArr['INBOUND']
                ->groupBy('date')
                ->map(function ($item) {
                    return [
                        'weight' => number_format($item->sum('weight'), 3, '.', ''),
                    ];
                });
        }

        if ($wtGroupByDate->has('OUTBOUND')) {
            $outboundArr = $wtGroupByDate->only(['OUTBOUND']);

            // Add up Outbound weight by daily
            $totalWtOutbound = $outboundArr['OUTBOUND']
                ->groupBy('date')
                ->map(function ($item) {
                    return [
                        'weight' => number_format($item->sum('weight'), 3, '.', ''),
                    ];
                });

        }

        // Check the difference by key DATE
        // Inbound
        $inboundDiffFromOutbound = $totalWtOutbound->diffKeys($totalWtInbound)->map(function ($item) {
            return [
                ...$item,
                'weight' => 0,
            ];
        })->union($totalWtInbound)->sortKeys();

        $inboundWt = $inboundDiffFromOutbound->pluck('weight');

        // Outbound
        $outboundDiffFromInbound = $totalWtInbound->diffKeys($totalWtOutbound)->map(function ($item) {
            return [
                ...$item,
                'weight' => 0,
            ];
        })->union($totalWtOutbound)->sortKeys();

        $outboundWt = $outboundDiffFromInbound->pluck('weight');

        return [
            'dates' => $wtDates,
            'weight' => [$inboundWt, $outboundWt],
        ];
    }

    public function getInboundOutboundTxn($customerCode)
    {
        $mandt = SapRfcFacade::getMandt();

        $fromDate = Carbon::today()->subMonth()->format('Ymd');
        $toDate = Carbon::today()->format('Ymd');

        $likp = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'LIKP')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ '{$mandt}'"],
                ['TEXT' => " AND KUNAG EQ '{$customerCode}'"],
                ['TEXT' => " AND (ERDAT GE '{$fromDate}'"],
                ['TEXT' => " AND ERDAT LE '{$toDate}')"],

            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'VBELN'], 
                ['FIELDNAME' => 'XABLN'],
                ['FIELDNAME' => 'ERDAT'],
            ])
            ->getDataToArray();

        $collectionTxn = collect($likp)
            ->values()
            ->map(function ($item) {

                //get type
                $type = null;
                if (substr($item['VBELN'], 0, 3) == '018') {
                    $type = 'INBOUND';
                } 
                if (substr($item['VBELN'], 0, 3) == '008') { 
                    $type = 'OUTBOUND';
                }

                return [
                    'type' => $type,
                    'date' => $item['ERDAT'],
                    'docNo' => $item['VBELN'],
                    'slipNo' => $item['XABLN'],
                ];
            });

        $txnGroupByDate = $collectionTxn->groupBy('type');
        $txnDates = $collectionTxn->unique('date')->pluck('date')
            ->sort()
            ->map(function ($item) {
                $formatDate = Carbon::parse($item)->format('M. d');

                return $formatDate;
            })
            ->values();

        if ($txnGroupByDate->has('INBOUND')) {
            $inboundArr = $txnGroupByDate->only(['INBOUND']);

            // Count Inbound transactions
            $countTnxInbound = $inboundArr['INBOUND']
                ->groupBy('date')
                ->map(function ($item) {
                    return [
                        'transactions' => $item->pluck('slipNo')->unique()->count()
                    ];
                });
        }

        if ($txnGroupByDate->has('OUTBOUND')) {
            $outboundArr = $txnGroupByDate->only(['OUTBOUND']);

             // Count Outbound transactions
            $countTnxOutbound = $outboundArr['OUTBOUND']
                ->groupBy('date')
                ->map(function ($item) {
                    return [
                        'transactions' => $item->pluck('docNo')->unique()->count()
                    ];
                });

        }

        // Check the difference by key DATE
        // Inbound
        $inboundDiffFromOutbound = $countTnxOutbound->diffKeys($countTnxInbound)->map(function ($item) {
            return [
                ...$item,
                'transactions' => 0,
            ];
        })->union($countTnxInbound)->sortKeys();

        $inboundTransactions = $inboundDiffFromOutbound->pluck('transactions');

        // Outbound
        $outboundDiffFromInbound = $countTnxInbound->diffKeys($countTnxOutbound)->map(function ($item) {
            return [
                ...$item,
                'transactions' => 0,
            ];
        })->union($countTnxOutbound)->sortKeys();

        $outboundTransactions = $outboundDiffFromInbound->pluck('transactions');

        return [
            'dates' => $txnDates,
            'counts' => [$inboundTransactions, $outboundTransactions],
        ];
    }


    public function getActiveSku($customerCode, $date)
    {
        $mandt = SapRfcFacade::getMandt();

        $arr = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'LIPS')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ {$mandt}"],
                ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
                ['TEXT' => " AND ERDAT EQ '{$date}'"],
                ['TEXT' => " AND CHARG NE ''"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'ERDAT'],
                ['FIELDNAME' => 'BWART'],
                ['FIELDNAME' => 'BRGEW'],
                ['FIELDNAME' => 'VBELN'],
                ['FIELDNAME' => 'MATNR'],
            ])
            ->getDataToArray();

        $collectionSku = collect($arr);

        return [
            'inboundSum' => number_format(round($collectionSku->where('BWART', '=', 501)->sum('BRGEW'), 3), 3),
            'outboundSum' => number_format(round($collectionSku->where('BWART', '!=', 501)->sum('BRGEW'), 3), 3), // round off 3 digits
            'transactionCount' => $collectionSku->unique('VBELN')->count(),
            'activeSku' => $collectionSku->unique('MATNR')->count(),
        ];
    }
}
