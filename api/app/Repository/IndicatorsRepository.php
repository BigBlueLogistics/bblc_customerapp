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

        $monthOfJan = Carbon::now()->format('Y'). '0101';

        $lips = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'LIPS')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ {$mandt}"],
                ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
                ['TEXT' => " AND ERDAT GE '{$monthOfJan}'"],
                ['TEXT' => " AND CHARG NE ''"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'ERDAT'],
                ['FIELDNAME' => 'BWART'],
                ['FIELDNAME' => 'BRGEW'],
            ])
            ->getDataToArray();

        $collectionTransPerWeek = collect($lips)
          ->values()
          ->map(function($item){

            // get the week number
            $date = strtotime(trim($item['ERDAT']));
            $week = idate('W', $date);

            //get type
            if(trim($item['BWART']) == '501'){
              $type="INBOUND";
            }
            else{
              $type="OUTBOUND";
            }

            return [
              'week' => $week,
              'type' => $type,
              'weight' => $item['BRGEW']
            ];
          })
          ->groupBy('type');

          // Add up Inbound by week 
          if($collectionTransPerWeek->has('INBOUND')) {
            $inboundArr = $collectionTransPerWeek->only(['INBOUND']);

            $totalInbound = $inboundArr['INBOUND']->groupBy('week')->map(function($item) {
                return [
                    'weight' => number_format($item->sum('weight'), 3, ".","")
                ];               
            });
          }

            // Add up Outbound by week 
            if($collectionTransPerWeek->has('OUTBOUND')) {
              $outboundArr = $collectionTransPerWeek->only(['OUTBOUND']);
              
              $totalOutbound = $outboundArr['OUTBOUND']->groupBy('week')->map(function($item) {
                  return [
                      'weight' => number_format($item->sum('weight'), 3, ".","")
                  ];                 
              });
            }

        return [
          'inboundPerWeek' => $totalInbound ?? null,
          'outboundPerWeek' => $totalOutbound ?? null,
        ];
    }


    public function getActiveSku($customerCode)
    {
      $mandt = SapRfcFacade::getMandt();

      $dateToday = Carbon::today()->format('Ymd');

      $arr = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
          ->param('QUERY_TABLE', 'LIPS')
          ->param('DELIMITER', ';')
          ->param('OPTIONS', [
              ['TEXT' => "MANDT EQ {$mandt}"],
              ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
              ['TEXT' => " AND ERDAT GE '{$dateToday}'"],
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
        'inboundSum' => $collectionSku->where('BWART', '=', 501)->sum('BRGEW'),
        'outboundSum' => $collectionSku->where('BWART', '!=', 501)->sum('BRGEW'), // round off 3 digits
        'transactionCount'=> $collectionSku->unique('VBELN')->count(),
        'activeSku' => $collectionSku->unique('MATNR')->count(),
      ];
    }

}