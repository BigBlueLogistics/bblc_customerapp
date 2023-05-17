<?php

namespace App\Repository;

use Illuminate\Support\Facades\DB;
use App\Interfaces\IMovementRepository;
use App\Facades\SapRfcFacade;
use App\Traits\StringEncode;
use Carbon\Carbon;

class MovementRepository implements IMovementRepository
{
    use StringEncode;

    public function outboundMov($materialCode, $fromDate, $toDate, $warehouseNo)
    {
        $formatWarehouse = str_replace('BB', 'W', $warehouseNo);

        $mandt = SapRfcFacade::getMandt();
        $lips = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'LIPS')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ '{$mandt}'"],
                ['TEXT' => " AND LGNUM EQ '{$formatWarehouse}'"],
                ['TEXT' => " AND MATNR EQ '{$materialCode}'"],
                ['TEXT' => " AND CHARG NE ''"],
                ['TEXT' => " AND VBELN NOT LIKE '018%'"],
                ['TEXT' => " AND (ERDAT >= '{$fromDate}'"],
                ['TEXT' => " AND ERDAT <= '{$toDate}')"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'VBELN'],
                ['FIELDNAME' => 'ERDAT'],
                ['FIELDNAME' => 'ARKTX'],
                ['FIELDNAME' => 'CHARG'],
                ['FIELDNAME' => 'VFDAT'],
                ['FIELDNAME' => 'BRGEW'],
                ['FIELDNAME' => 'LFIMG'],
                ['FIELDNAME' => 'VRKME'],
                ['FIELDNAME' => 'VGBEL'],
            ])
            ->getDataToArray();

            $outbound = collect($lips);

            if($outbound->count()){
               $outbound = $outbound->map(function($item) use ($mandt){
                    $vgbel = $item['VGBEL'];
                    $date = Carbon::parse($item['ERDAT'])->format('m/d/Y');
                    $expiration = Carbon::parse($item['VFDAT'])->format('m/d/Y');

                    $textLines = SapRfcFacade::functionModule('RFC_READ_TEXT')
                                ->param('TEXT_LINES', array(
                                    "TEXT_LINES" => array(
                                        "TDOBJECT" => "VBBK",
                                        "TDID" => "0001",
                                        "TDSPRAS" => "E",
                                        "TDNAME" => $item['VBELN']
                                    )
                                ))
                                ->getData();


                    $vbak = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
                            ->param('QUERY_TABLE', 'VBAK')
                            ->param('DELIMITER', ';')
                            ->param('ROWCOUNT', 1)
                            ->param('OPTIONS', [
                                ['TEXT' => "MANDT EQ '{$mandt}'"],
                                ['TEXT' => " AND VBELN EQ '{$vgbel}'"],
                            ])
                            ->param('FIELDS', [
                                ['FIELDNAME' => 'BSTNK'],
                            ])
                            ->getDataToArray();

                    return [
                        'date' => $date,
                        'documentNo' => $item['VBELN'],
                        'movementType' => "OUTBOUND",
                        'description' => $item['ARKTX'],
                        'batch' => $item['CHARG'],
                        'expiration' => $expiration,
                        'quantity' => $item['LFIMG'],
                        'unit' => $item['VRKME'],
                        'weight' => $item['BRGEW'],
                        'header' => $textLines['TEXT_LINES'][0]['TDLINE'] ?? "",
                        'refrn' => $vbak[0]['BSTNK'] ?? "",
                    ];
                });
            }

        return $outbound->toArray();
    }

    public function inboundMov($materialCode, $fromDate, $toDate, $warehouseNo)
    {
        $formatWarehouse = str_replace('BB', 'WH', $warehouseNo);

        $res = DB::connection('wms-prd')->table('lips')
                ->leftJoin('likp','lips.vbeln','=','likp.vbeln')
                ->select('lips.*', 'lips.maktx', 'lips.meinh' ,'likp.headr', 'likp.erdat')
                ->where('lips.lgnum','=',$formatWarehouse)
                ->where('lips.matnr','=', $materialCode)
                ->where('lips.charg','!=', 'null')
                ->whereBetween('likp.erdat', [$fromDate, $toDate])
                ->get();

                
            $inbound = $res->map(function($item){
                $qty = explode('/', $item->meinh)[1] ?? "";
                $date = Carbon::parse($item->erdat)->format('m/d/Y');
                $expiration = Carbon::parse($item->vfdat)->format('m/d/Y');

                return [
                    'date' => $date,
                    'documentNo' => $item->vbeln,
                    'movementType' => "INBOUND",
                    'description' => $item->maktx,
                    'batch' => $item->charg,
                    'expiration' => $expiration,
                    'quantity' => $item->lfimg,
                    'unit' => $qty,
                    'weight' => $item->brgew,
                    'header' => $item->headr,
                ];
        });

        return $inbound->toArray();

    }

    public function mergeInOutbound($materialCode, $fromDate, $toDate, $warehouseNo)
    {
        $inbound = $this->inboundMov($materialCode, $fromDate, $toDate, $warehouseNo);
        $outbound = $this->outboundMov($materialCode, $fromDate, $toDate, $warehouseNo);

        return array_merge($inbound, $outbound);
    }
}