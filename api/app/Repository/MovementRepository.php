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

    // TODO: In UI Covered Date Max of 3 months display.
    public function outboundMov($materialCode, $fromDate, $toDate, $warehouseNo)
    {
        $formatFromDate = Carbon::createFromFormat('Y/m/d', $fromDate)->format('Ymd');
        $formatToDate = Carbon::createFromFormat('Y/m/d', $toDate)->format('Ymd');
        $formatWarehouse = str_replace('H', '', $warehouseNo);

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
                ['TEXT' => " AND (ERDAT >= '{$formatFromDate}'"],
                ['TEXT' => " AND ERDAT <= '{$formatToDate}')"],
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

            $data = [];
            if(count($lips)){
               $data = collect($lips)->map(function($item) use ($mandt){
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
                        'HEADER' => $textLines['TEXT_LINES'][0]['TDLINE'] ?? "",
                        'REFRN' => $vbak[0]['BSTNK'] ?? ""
                    ];
                });
            }

        return $data;
    }

    public function inboundMov($materialCode, $fromDate, $toDate, $warehouseNo)
    {
        // Note: join table LIPS and LIKP
        // in LIKP get only field HEADR and
        // in LIPS get all fields
        // bwmid = vbeln
        $formatFromDate = Carbon::createFromFormat('Y/m/d', $fromDate)->format('Ymd');
        $formatToDate = Carbon::createFromFormat('Y/m/d', $toDate)->format('Ymd');

        $res = DB::connection('wms-prd')->table('lips')
                ->leftJoin('likp','lips.vbeln','=','likp.vbeln')
                ->select('lips.*','likp.headr')
                ->where('lips.lgnum','=',$warehouseNo)
                ->where('lips.matnr','=', $materialCode)
                ->where('lips.charg','!=', 'null')
                ->where('lips.bwmid','not like','018%')
                ->whereBetween('likp.erdat', [$formatFromDate, $formatToDate])
                ->get();

        return $res;

    }
}