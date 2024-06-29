<?php

namespace App\Repository;

use App\Facades\SapRfcFacade;
use App\Interfaces\IMovementRepository;
use App\Traits\StringEncode;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MovementRepository implements IMovementRepository
{
    use StringEncode;

    public function outboundMov($materialCode, $fromDate, $toDate, $warehouseNo, $customerCode, $generateType)
    {
        $outboundCustomerCode = '';
        if (strtolower($warehouseNo) != 'all') {
            $formatWarehouse = str_replace('BB', 'W', $warehouseNo);
            $optLGNUM = ['TEXT' => " AND LGNUM EQ '{$formatWarehouse}'"];
        } else {
            $formatWarehouse = '';
            $optLGNUM = [];
        }

        if (strtolower($materialCode) != 'all') {
            $outboundCustomerCode = $materialCode;
            $optMATNR = ['TEXT' => " AND MATNR EQ '{$materialCode}'"];
        } else {
            $outboundCustomerCode = $customerCode;
            $optMATNR = ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"];
        }

        $mandt = SapRfcFacade::getMandt();

        $likp = SapRfcFacade::functionModule('ZFM_ERP_LIKP_TABLEREAD_1')
                ->param('IV_CUSTOMER', $outboundCustomerCode)
                ->param('IV_TYPE', 'LF')
                ->param('IV_WAREHOUSENO', $formatWarehouse)
                ->param('IV_DOCSTART', $fromDate)
                ->param('IV_DOCEND', $toDate)
                ->getData();


        $collectLikp = collect($likp['T_ERP_LIKP_MKPF'])->groupBy('VBELN')->toArray();

        $lips = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'LIPS')
            ->param('SORT_FIELDS', 'VBELN')
            ->param('ORDER_BY_COLUMN', '2')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ '{$mandt}'"],
                $optLGNUM,
                $optMATNR,
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
                ['FIELDNAME' => 'LGNUM'],
                ['FIELDNAME' => 'MATNR'],
            ])
            ->getDataToArray();

        $outbound = collect($lips);

        if ($outbound->count()) {
            $outbound = $outbound->map(function ($item) use ($collectLikp){
                $expiration = Carbon::parse($item['VFDAT'])->format('m/d/Y');
                $vblen = $item['VBELN'];
                $wadat = '';
                $bstkd = '';
                $xblnr = '';
                $budat = '';
                if(array_key_exists($vblen, $collectLikp)){
                    $wadat =  Carbon::parse($collectLikp[$vblen][0]['WADAT'])->format('m/d/Y') ?? '';
                    $bstkd =  trim($collectLikp[$vblen][0]['BSTKD']) ?? '';
                    $xblnr =  trim($collectLikp[$vblen][0]['XBLNR']) ?? '';
                    $budat =  trim($collectLikp[$vblen][0]['BUDAT']) ?? '';
                }

                    return [
                        'date' => $wadat,
                        'materialCode' => $item['MATNR'],
                        'documentNo' => $vblen,
                        'movementType' => 'OUTBOUND',
                        'description' => $item['ARKTX'],
                        'batch' => $item['CHARG'],
                        'expiration' => $expiration,
                        'quantity' => $item['LFIMG'],
                        'unit' => $item['VRKME'],
                        'weight' => $item['BRGEW'],
                        'warehouse' => str_replace('W', 'WH', $item['LGNUM']),
                        'documentNoRef' => $item['VGBEL'],
                        'reference' => $bstkd,
                        'vehicle'=> $xblnr,
                        'budat' => $budat,
                    ];                
            })->filter(function($item){
                return $item['budat'] != '';
            });
            
        }

        // lazy load the column headerText and reference
        if ($generateType === 'table') {
            return $outbound->values()->toArray();
        } else {
            return $this->outboundMovExcel($outbound->values()->toArray());
        }

    }

    public function outboundMovExcel($data)
    {
        $collectionData = collect($data);
        $keysGroupOutbound = $collectionData
            ->groupBy(function ($item) {
                return $item['documentNo'].'/'.$item['documentNoRef'];
            })
            ->keys()
            ->mapWithKeys(function ($item) {
                [$documentNo, $documentNoRef] = explode('/', $item);

                $subDetails = $this->outboundSubDetails($documentNo, $documentNoRef);

                return [$item => $subDetails];
            });

        $merged = $collectionData->map(function ($item) use ($keysGroupOutbound) {
            $groupBy = $item['documentNo'].'/'.$item['documentNoRef'];
            $subDetails = $keysGroupOutbound[$groupBy];

            $item['headerText'] = $subDetails['headerText'];
            $item['reference'] = $subDetails['reference'];

            return $item;
        });

        return $merged->all();

    }

    public function inboundMov($materialCode, $fromDate, $toDate, $warehouseNo, $customerCode)
    {

        $isNotAllWarehouse = boolval(strtolower($warehouseNo) != 'all');
        $isAllMaterial = boolval(strtolower($materialCode) == 'all');

        $likpSubQuery = DB::raw("(SELECT BWMID, ERDAT, HEADR, PONUM, VNMBR, BUDAT FROM LIKP WHERE ERDAT BETWEEN '{$fromDate}' AND '{$toDate}' GROUP BY BWMID, ERDAT, HEADR, PONUM, VNMBR, BUDAT ) AS likp");
        $res = DB::connection('wms')->table('lips')
            ->leftJoin($likpSubQuery, 'lips.bwmid', '=', 'likp.bwmid')
            ->selectRaw('likp.bwmid, likp.erdat, likp.headr,
                    SUM(lips.lfimg) AS lfimg, SUM(lips.brgew) AS brgew,
                    lips.matnr, lips.maktx, lips.charg, lips.meinh,
                    lips.vfdat, lips.lgnum, likp.ponum, likp.vnmbr, likp.budat'
            )
            ->when($isNotAllWarehouse, function ($query) use ($warehouseNo) {
                $formatWarehouse = str_replace('BB', 'WH', $warehouseNo);

                return $query->where('lips.lgnum', '=', $formatWarehouse);
            })
            ->when($isAllMaterial, function ($query) use ($customerCode) {
                return $query->where('lips.matnr', 'like', $customerCode.'%');

            }, function ($query) use ($materialCode) {
                return $query->where('lips.matnr', '=', $materialCode);
            })
            ->where('lips.charg', '!=', 'null')
            ->whereBetween('likp.erdat', [$fromDate, $toDate])
            ->groupBy('lips.matnr', 'lips.charg', 'lips.meinh', 'lips.maktx', 'lips.vfdat', 'lips.lgnum', 'likp.headr', 'likp.erdat', 'likp.bwmid', 'likp.ponum', 'likp.vnmbr', 'likp.budat')
            ->orderBy('likp.bwmid', 'asc')
            ->get();

        $inbound = $res->map(function ($item) {
            $explodeMeinh = explode('/', $item->meinh);
            // delete the string parentheses ()
            $unit =  count($explodeMeinh) > 1 ? $explodeMeinh[1] : preg_replace('~\([^()]*\)~','', $explodeMeinh[0]) ;
            $date = Carbon::parse($item->erdat)->format('m/d/Y');
            $expiration = Carbon::parse($item->vfdat)->format('m/d/Y');

                return [
                    'date' => $date,
                    'materialCode' => $item->matnr,
                    'documentNo' => $item->bwmid,
                    'movementType' => 'INBOUND',
                    'description' => $item->maktx,
                    'batch' => $item->charg,
                    'expiration' => $expiration,
                    'quantity' => $item->lfimg,
                    'unit' => $unit,
                    'weight' => $item->brgew,
                    'headerText' => $item->headr,
                    'reference' => $item->ponum,
                    'warehouse' => $item->lgnum,
                    'vehicle' => $item->vnmbr,
                    'budat'=> $item->budat,
                ];
            
        })->filter(function($item){
            return $item['budat'] != '';
        });

        return $inbound->values()->toArray();

    }

    public function mergeInOutbound($materialCode, $fromDate, $toDate, $warehouseNo, $customerCode, $generateType)
    {
        $inbound = $this->inboundMov($materialCode, $fromDate, $toDate, $warehouseNo, $customerCode);
        $outbound = $this->outboundMov($materialCode, $fromDate, $toDate, $warehouseNo, $customerCode, $generateType);

        $mergeInOut = array_merge($inbound, $outbound);
        $collectionMergeInOut = collect($mergeInOut)->sortBy('documentNo')
            ->values()
            ->all();

        return $collectionMergeInOut;
    }

    public function outboundReference($documentNoRef)
    {
        $mandt = SapRfcFacade::getMandt();
        $reference = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'VBAK')
            ->param('DELIMITER', ';')
            ->param('ROWCOUNT', 1)
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ '{$mandt}'"],
                ['TEXT' => " AND VBELN EQ '{$documentNoRef}'"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'BSTNK'],
                ['FIELDNAME' => 'VGBEL'],
            ])
            ->getDataToArray();
        
        return $reference[0]['BSTNK'] ?? '';

    }

    public function outboundSubDetails($documentNo, $documentNoRef)
    {
        $headerText = SapRfcFacade::functionModule('RFC_READ_TEXT')
            ->param('TEXT_LINES', [
                'TEXT_LINES' => [
                    'TDOBJECT' => 'VBBK',
                    'TDID' => '0001',
                    'TDSPRAS' => 'E',
                    'TDNAME' => $documentNo,
                ],
            ])
            ->getData();

        $textLines = collect($headerText['TEXT_LINES'])->reduce(function ($total, $item) {
            $total[] = trim($item['TDLINE']);

            return $total;
        }) ?? [];

        return [
            'headerText' => implode(' ', $textLines),
            'reference' => $this->outboundReference($documentNoRef),
        ];
    }

    public function materialAndDescription($customerCode)
    {
        $mandt = SapRfcFacade::getMandt();
        $makt = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'MAKT')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ '{$mandt}'"],
                ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'MATNR'],
                ['FIELDNAME' => 'MAKTX'],
            ])
            ->getDataToArray();

        $collection = collect($makt)->map(function ($item, $index) {
            return [
                'id' => $index += 1,
                'material' => $item['MATNR'],
                'description' => $item['MAKTX'],
            ];
        })
            ->values()
            ->all();

        return $collection;
    }
}
