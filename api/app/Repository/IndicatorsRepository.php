<?php

namespace App\Repository;

use App\Interfaces\IIndicatorsRepository;
use App\Facades\SapRfcFacade;
use Carbon\Carbon;

class IndicatorsRepository implements IIndicatorsRepository
{

    public function getInboundOutbound($customerCode)
    {
        $mandt = SapRfcFacade::getMandt();

        $fromDate = Carbon::today()->subMonth();
        $toDate = Carbon::today();

        $lips = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'LIPS')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ {$mandt}"],
                ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
                ['TEXT' => " AND (ERDAT GE '{$fromDate->format('Ymd')}'"],
                ['TEXT' => " AND ERDAT LE '{$toDate->format('Ymd')}')"],
                ['TEXT' => " AND CHARG NE ''"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'ERDAT'],
                ['FIELDNAME' => 'BWART'],
                ['FIELDNAME' => 'BRGEW'],
            ])
            ->getDataToArray();

        $collectionTrn = collect($lips)
          ->values()
          ->map(function($item){

            // get date
            $date = $item['ERDAT'];

            //get type
            if(trim($item['BWART']) == '501'){
              $type="INBOUND";
            }
            else{
              $type="OUTBOUND";
            }

            return [
              'date' => $date,
              'type' => $type,
              'weight' => $item['BRGEW']
            ];
          });
          
          $trnGroupByDate = $collectionTrn->groupBy('type');
          $trnDates = $collectionTrn->unique('date')->pluck('date')
            ->sort()
            ->map(function($item){
                $formatDate = Carbon::parse($item)->format('M. d');
              return $formatDate;
            })
            ->values();

          // Add up Inbound by daily 
          if($trnGroupByDate->has('INBOUND')) {
            $inboundArr = $trnGroupByDate->only(['INBOUND']);

            $totalInbound = $inboundArr['INBOUND']
                  ->groupBy('date')
                  ->map(function($item) {
                        return [
                            'weight' => number_format($item->sum('weight'), 3, ".","")
                        ];               
                    });
          }

            // Add up Outbound by daily 
            if($trnGroupByDate->has('OUTBOUND')) {
              $outboundArr = $trnGroupByDate->only(['OUTBOUND']);
              
              $totalOutbound = $outboundArr['OUTBOUND']
                  ->groupBy('date')
                  ->map(function($item) {
                        return [
                            'weight' => number_format($item->sum('weight'), 3, ".","")
                        ];                 
                    });
            }

            // Check the difference by key DATE
            // Inbound
            $inboundDiffFromOutbound = $totalOutbound->diffKeys($totalInbound)->map(function($item){
              return [
                ...$item,
                'weight' => 0
              ];
            })->union($totalInbound)->sortKeys()->pluck('weight');

            // Outbound
            $outboundDiffFromInbound = $totalInbound->diffKeys($totalOutbound)->map(function($item){
              return [
                ...$item,
                'weight' => 0
              ];
            })->union($totalOutbound)->sortKeys()->pluck('weight');

        return [
          'transactions' => [$inboundDiffFromOutbound, $outboundDiffFromInbound],
          'transactionsDates' => $trnDates
        ];
    }


    public function getActiveSku($customerCode)
    {
      $mandt = SapRfcFacade::getMandt();

      $fromDate = Carbon::today()->format('Ymd');

      $arr = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
          ->param('QUERY_TABLE', 'LIPS')
          ->param('DELIMITER', ';')
          ->param('OPTIONS', [
              ['TEXT' => "MANDT EQ {$mandt}"],
              ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
              ['TEXT' => " AND ERDAT GE '{$fromDate}'"],
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
        'transactionCount'=> $collectionSku->unique('VBELN')->count(),
        'activeSku' => $collectionSku->unique('MATNR')->count(),
      ];
    }

}