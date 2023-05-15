<?php

namespace App\Repository;

use Illuminate\Support\Facades\DB;
use App\Interfaces\IMovementRepository;
use App\Facades\SapRfcFacade;
use App\Traits\StringEncode;

class MovementRepository implements IMovementRepository
{
    use StringEncode;

    public function outboundMov($materialCode, $fromDate, $toDate, $warehouseNo)
    {
        $mandt = SapRfcFacade::getMandt();
        $lips = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'LIPS')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ '{$mandt}'"],
                ['TEXT' => " AND LGNUM EQ '{$warehouseNo}'"],
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

            $outbound = [];
            if(count($lips)){
               $outbound = collect($lips)->map(function($item) use ($mandt){
                    $vgbel = $item['VGBEL'];
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
                        ...$item,
                        'header' => $textLines['TEXT_LINES'][0]['TDLINE'] ?? "",
                        'refrn' => $vbak[0]['BSTNK'] ?? ""
                    ];
                });
            }

        return $outbound;
    }

    public function inboundMov($materialCode, $fromDate, $toDate, $warehouseNo)
    {
        $inbound = DB::connection('wms-prd')->table('lips')
                ->leftJoin('likp','lips.vbeln','=','likp.vbeln')
                ->select('lips.*', 'lips.maktx AS ARKTX', 'lips.meinh as VRKME' ,'likp.headr', 'likp.erdat')
                ->where('lips.lgnum','=',$warehouseNo)
                ->where('lips.matnr','=', $materialCode)
                ->where('lips.charg','!=', 'null')
                ->where('lips.bwmid','not like','018%')
                ->whereBetween('likp.erdat', [$fromDate, $toDate])
                ->get();

        return $inbound;

    }
}