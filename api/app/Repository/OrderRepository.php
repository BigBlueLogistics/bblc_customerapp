<?php

namespace App\Repository;

use App\Facades\SapRfcFacade;
use App\Interfaces\IOrderRepository;
use App\Models\Milestone;
use App\Models\OrderHeader;
use App\Traits\StringEncode;
use Carbon\Carbon;
use DB;
use Storage;

class OrderRepository implements IOrderRepository
{
    use StringEncode;

    protected const EXCEL_ROOT_DIR = 'excel';

    protected const EXCEL_DISK = 'excel';

    public function materialAndDescription($customerCode, $warehouseNo)
    {
        $warehouseNo = str_replace('BB', 'WH', $warehouseNo);

        $result = SapRfcFacade::functionModule('ZFM_EWM_TABLEREAD')
            ->param('IV_CUSTOMER', $customerCode)
            ->param('IV_WAREHOUSENO', $warehouseNo)
            ->getData();

        $products = $this->convert_latin1_to_utf8_recursive($result['T_SCWM_AQUA']);

        $collectionProducts = collect($products)
            ->unique(function ($item) {
                return $item['MATNR'].$item['MAKTX'];
            })
            ->filter(function ($item) {
                return $item['LGPLA'] !== 'GI_ZONE' && $item['CAT'] === 'F1';
            })
            ->map(function ($item, $index) {
                return [
                    'id' => $index += 1,
                    'material' => $item['MATNR'],
                    'description' => $item['MAKTX'],
                ];
            })
            ->values()->all();

        return $collectionProducts;
    }

    public function expiryBatch($materialCode, $warehouseNo)
    {
        $warehouseNo = str_replace('BB', 'WH', $warehouseNo);

        $result = SapRfcFacade::functionModule('ZFM_EWM_TABLEREAD')
            ->param('IV_CUSTOMER', $materialCode)
            ->param('IV_WAREHOUSENO', $warehouseNo)
            ->getData();

        $products = $this->convert_latin1_to_utf8_recursive($result['T_SCWM_AQUA']);

        $collectionProducts = collect($products)
            ->filter(function ($item) {
                return $item['LGPLA'] !== 'GI_ZONE' && $item['CAT'] === 'F1';
            })
            ->map(function ($item, $index) {
                $expiry = Carbon::parse($item['VFDAT'])->format('m-d-Y');

                return [
                    'id' => $index += 1,
                    'code' => $item['MATNR'],
                    'batch' => $item['CHARG'],
                    'expiry' => $expiry,
                    'quantity' => round((float) $item['QUAN'], 3),
                ];
            })
            ->values();

        return $collectionProducts;
    }

    public function productUnits($materialCode)
    {
        $mandt = SapRfcFacade::getMandt();
        $marm = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'MARM')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT EQ {$mandt}"],
                ['TEXT' => " AND MATNR EQ '{$materialCode}'"],
                ['TEXT' => " AND MEINH NE 'KG'"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'UMREZ'],
                ['FIELDNAME' => 'UMREN'],
                ['FIELDNAME' => 'MEINH'],
            ])
            ->getDataToArray();

        if (count($marm)) {
            $collectionMarm = collect($marm)->map(function ($item) {
                $unit = is_null($item['MEINH']) ? 'KG' : $item['MEINH'];
                $fixedWt = is_null($item['UMREZ']) ? 1 : (float) $item['UMREZ'] / (float) $item['UMREN'];

                return round($fixedWt, 3).' / '.$unit;
            });
        } else {
            $collectionMarm = ['1 / KG'];
        }

        return $collectionMarm;
    }

    public function readText($docNo)
    {
        $type = '';

        if (substr($docNo, 0, 3) == '008') {
            $type = '0001';
        } else {
            $type = 'TX03';
        }

        $headerText = SapRfcFacade::functionModule('RFC_READ_TEXT')
            ->param('TEXT_LINES', [
                'TEXT_LINES' => [
                    'TDOBJECT' => 'VBBK',
                    'TDID' => $type,
                    'TDSPRAS' => 'E',
                    'TDNAME' => $docNo,
                ],
            ])
            ->getData();

        $textLines = collect($headerText['TEXT_LINES'])->reduce(function ($total, $item) {
            $total[] = trim($item['TDLINE']);

            return $total;
        }) ?? [];

        return implode(' ', $textLines);
    }

    public function adhocDetails($customerCode, $docNo)
    {
        $mandt = SapRfcFacade::getMandt();
        $docDetails = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'LIKP')
            ->param('DELIMITER', ';')
            ->param('ROWCOUNT', 1)
            ->param('OPTIONS', [
                ['TEXT' => "KUNAG EQ '{$customerCode}'"],
                ['TEXT' => " AND VBELN EQ '{$docNo}'"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'VBELN'],
                ['FIELDNAME' => 'ERNAM'],
                ['FIELDNAME' => 'ERDAT'],
                ['FIELDNAME' => 'BTGEW'],
                ['FIELDNAME' => 'XABLN'],
                ['FIELDNAME' => 'DLV_VERSION'],
                ['FIELDNAME' => 'LFART'],
                ['FIELDNAME' => 'KUNAG'],
                ['FIELDNAME' => 'LGNUM'],
                ['FIELDNAME' => 'ERZET'],
                ['FIELDNAME' => 'WADAT'],
            ])
            ->getDataToArray();

        if (count($docDetails) == 0) {
            return [
                'status' => 'failed',
                'message' => "Document {$docNo} not found at warehouse.",
            ];
        }

        $dlv_version = $docDetails[0]['DLV_VERSION'];

        if ($dlv_version == '0002') {
            // get the source document
            $sourceDoc = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
                ->param('QUERY_TABLE', 'LEDSPD_FLOW')
                ->param('DELIMITER', ';')
                ->param('ROWCOUNT', 1)
                ->param('OPTIONS', [
                    ['TEXT' => "VBELN EQ '{$docNo}'"],
                ])
                ->param('FIELDS', [
                    ['FIELDNAME' => 'VBELN_NEW'],
                ])
                ->getDataToArray();

            if (count($sourceDoc)) {
                $newVbeln = $sourceDoc[0]['VBELN_NEW'];
            } else {
                $dlv_version = '';
            }
        }

        if ($dlv_version == '2') {
            $optDoc = ['TEXT' => "VBELN EQ '{$newVbeln}'"];
        } else {
            $optDoc = ['TEXT' => "VBELN EQ '{$docNo}'"];
        }

        // get the VBELV number
        $vgbelNo = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'LIPS')
            ->param('DELIMITER', ';')
            ->param('ROWCOUNT', 1)
            ->param('OPTIONS', [
                $optDoc,
                ['TEXT' => " AND VGBEL NE ''"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'VGBEL'],
            ])
            ->getDataToArray();

        // get the customer name
        $kunag = $docDetails[0]['KUNAG'];
        $customerName = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'KNA1')
            ->param('DELIMITER', ';')
            ->param('ROWCOUNT', 1)
            ->param('OPTIONS', [
                ['TEXT' => "KUNNR EQ '{$kunag}'"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'NAME1'],
            ])
            ->getDataToArray();

        // get the SO information
        if (count($vgbelNo)) {
            $vbelv = $vgbelNo[0]['VGBEL'];
            $vbak = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
                ->param('QUERY_TABLE', 'VBAK')
                ->param('DELIMITER', ';')
                ->param('ROWCOUNT', 1)
                ->param('OPTIONS', [
                    ['TEXT' => "VBELN EQ '{$vbelv}'"],
                ])
                ->param('FIELDS', [
                    ['FIELDNAME' => 'BSTNK'],
                    ['FIELDNAME' => 'ERDAT'],
                ])
                ->getDataToArray();
        }

        $createdDate = count($vbak) ? date('m/d/Y', strtotime($vbak[0]['ERDAT'])) : '';
        $date = $docDetails[0]['ERDAT'] ? date('m/d/Y', strtotime($docDetails[0]['WADAT'])) : '';

        $erzet = $docDetails[0]['ERZET'] ?? '';
        $createdTime = substr($erzet, 0, 2).':'.substr($erzet, 2, 2).':'.substr($erzet, 4, 2);

        $output['info'] = [
            'docNo' => $docDetails[0]['VBELN'],
            'customerCode' => $docDetails[0]['KUNAG'],
            'customerName' => $customerName[0]['NAME1'] ?? '',
            'createdDate' => $createdDate,
            'createdTime' => $createdTime,
            'createdBy' => $docDetails[0]['ERNAM'] ?? '',
            'requestNum' => $vbak[0]['BSTNK'] ?? '',
            'soNum' => $vbelv,
            'totalWeight' => $docDetails[0]['BTGEW'],
            'warehouse' => $docDetails[0]['LGNUM'],
            'date' => $date,
        ];

        // remarks
        $output['remarks'] = $this->readText($docNo);

        // check the status at eWM
        $output['status'] = 'No WH Request(s)';
        $refDoc = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', '/SCDL/DB_REFDOC')
            ->param('DELIMITER', ';')
            ->param('ROWCOUNT', 1)
            ->param('OPTIONS', [
                ['TEXT' => "REFDOCNO EQ '{$docNo}'"],
                ['TEXT' => " AND REFDOCCAT EQ 'ERP'"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'DOCID'],
            ])
            ->getDataToArray();

        if (count($refDoc)) {
            $docId = $refDoc[0]['DOCID'];

            // check if with existing WO
            $ordimO = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
                ->param('QUERY_TABLE', '/SCWM/ORDIM_O')
                ->param('DELIMITER', ';')
                ->param('ROWCOUNT', 1)
                ->param('OPTIONS', [
                    ['TEXT' => "MANDT EQ '{$mandt}'"],
                    ['TEXT' => " AND RDOCID EQ '{$docId}'"],
                ])
                ->param('FIELDS', [
                    ['FIELDNAME' => 'TANUM'],
                ])
                ->getDataToArray();

            if (count($ordimO)) {

                // check if there are confirmed
                $ordimC = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
                    ->param('QUERY_TABLE', '/SCWM/ORDIM_C')
                    ->param('DELIMITER', ';')
                    ->param('ROWCOUNT', 1)
                    ->param('OPTIONS', [
                        ['TEXT' => "MANDT EQ '{$mandt}'"],
                        ['TEXT' => " AND RDOCID EQ '{$docId}'"],
                    ])
                    ->param('FIELDS', [
                        ['FIELDNAME' => 'TANUM'],
                    ])
                    ->getDataToArray();

                if (count($ordimC)) {
                    $output['status'] = 'Picking had already been started';
                } else {
                    $output['status'] = 'Waiting for picker assignment';
                }

            } else {
                // check the confirmed
                $ordimC = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
                    ->param('QUERY_TABLE', '/SCWM/ORDIM_C')
                    ->param('DELIMITER', ';')
                    ->param('ROWCOUNT', 1)
                    ->param('OPTIONS', [
                        ['TEXT' => "MANDT EQ '{$mandt}'"],
                        ['TEXT' => " AND RDOCID EQ '{$docId}'"],
                    ])
                    ->param('FIELDS', [
                        ['FIELDNAME' => 'TANUM'],
                    ])
                    ->getDataToArray();

                if (count($ordimC)) {
                    $output['status'] = 'WH Picking Completed';
                } else {
                    $output['status'] = 'No Picklist(s) created yet';
                }

                // check if picking has started
                $ltak = DB::connection('wms')->select("SELECT VBELN, KQUIT FROM LTAK WHERE VBELN='{$docNo}'");

                if (! empty($ltak)) {
                    $output['status'] = 'WH Picking Started';

                    //check if all picked
                    $kquit = '';
                    foreach ($ltak as $val) {
                        if ($val->kquit == 'X') {
                            $kquit = 'X';
                        }
                    }
                    if ($kquit == 'X') {
                        $output['status'] = 'WH Picking Completed';
                    }

                }

                // check if posted
                $mkpf = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
                    ->param('QUERY_TABLE', 'MKPF')
                    ->param('DELIMITER', ';')
                    ->param('ROWCOUNT', 1)
                    ->param('OPTIONS', [
                        ['TEXT' => "LE_VBELN EQ '{$docNo}'"],
                    ])
                    ->param('FIELDS', [
                        ['FIELDNAME' => 'BUDAT'],
                        ['FIELDNAME' => 'USNAM'],
                    ])
                    ->getDataToArray();

                if (count($mkpf)) {
                    $output['status'] = 'Outbound Posted';

                    $output['budat'] = date('m/d/Y', strtotime($mkpf[0]['BUDAT']));
                    $output['bunam'] = $mkpf[0]['USNAM'];
                }
            }
        } else {
            $output['status'] = 'No Picklist(s) created yet';
        }

        // get the total pallet count
        $getltap = DB::connection('wms')
            ->select("SELECT DISTINCT NLENR FROM LTAP WHERE LGNUM='WH05' AND VBELN='{$docNo}' AND VLTYP='ASRS' AND ASRSN IS NOT NULL");
        $output['pallet'] = count($getltap);

        $getltappal = DB::connection('wms')
            ->select("SELECT DISTINCT NLENR FROM LTAP WHERE LGNUM='WH05' AND VBELN='{$docNo}' AND VLTYP='ASRS' AND ASRSN IS NOT NULL");
        $output['palcount'] = count($getltappal);

        // get the total pallet count
        $getltapitem = DB::connection('wms')
            ->select("SELECT DISTINCT MATNR FROM LTAP WHERE LGNUM='WH05' AND VBELN='{$docNo}' AND VLTYP='ASRS'");
        $output['itemcount'] = count($getltapitem);

        return $output;
    }

    public function createAdhocRequest($request, $authUser)
    {
        $currentDatetime = Carbon::now()->format('Y/m/d H:i:s');
        $isOrderExist = OrderHeader::where('vbeln', $request->docNo)->first();

        // Check if status had been "posted".
        $isStatusPosted = preg_match('/posted/i', $request->status);
        $statusPostedMsg = 'Transaction already posted, no further actions can be made.';

        if ($isOrderExist) {
            $updateOrder = OrderHeader::where('vbeln', $request->docNo)
                ->update(['audat' => $currentDatetime]);

            if ($updateOrder) {

                if ($isStatusPosted) {
                    return $statusPostedMsg;
                }

                return 'Request to be notified successfully updated.';
            }

            return null;
        } else {
            $erdat = Carbon::parse($request->createdDate)->format('Y/m/d');
            $ertim = Carbon::parse($request->createdTime)->format('H:i:s');
            $warehouse = str_replace('W', 'WH', $request->warehouse);

            $createOrder = OrderHeader::create([
                'lgnum' => $warehouse,
                'kunnr' => $request->customerCode,
                'erdat' => $erdat,
                'ertim' => $ertim,
                'ponum' => $request->soNum,
                'vbeln' => $request->docNo,
                'pudat' => $request->date,
            ]);

            $createMilestone = Milestone::create([
                'customer' => $request->customerCode,
                'delivery' => $request->docNo,
                'email' => $authUser->email,
                'phone_num' => $authUser->phone_num,
                'miles' => 6,
            ]);

            if ($createOrder && $createMilestone) {

                if ($isStatusPosted) {
                    return $statusPostedMsg;
                }

                return 'Request to be notified successfully created.';
            }

            return null;
        }
    }

    function uploadFile($request, $transId)
    {
        $uploadedFiles = null;
        if($request->hasFile('attachment'))
        {
            $excelRootDir = self::EXCEL_ROOT_DIR;
            if(!Storage::disk(self::EXCEL_DISK)->exists($excelRootDir)){
                Storage::makeDirectory($excelRootDir, 0777, true, true);
            }
    
            foreach($request->file('attachment') as $key => $file)
            {
                if($file->isValid())
                {
                    $fileName = strtolower($file->getClientOriginalName());
                    
                    $uploadedFiles[$key]['filename'] = $fileName;
                    $uploadedFiles[$key]['path'] = $file->storeAs($transId, $fileName, ['disk' => self::EXCEL_DISK]);
                }
            }

        } 
        return $uploadedFiles;
    }

    public function retrieveFile($transId)
    {
        $fileNames = null;
        if(Storage::disk(self::EXCEL_DISK)->exists($transId))
        {
            $files = Storage::disk(self::EXCEL_DISK)->files("{$transId}");
            
            if(count($files) > 0)
            {
                $fileNames = array_map(function($path){
                    $fileName = explode('/', $path)[1];
                    
                    return $fileName;
                }, $files);
            }
        }

        return $fileNames;
    }

    function deleteFile($fileNames, $transId)
    {
        if($fileNames && count($fileNames) && Storage::disk(self::EXCEL_DISK)->exists($transId))
        {
            $arrayFiles = array_map(function($fileName) use ($transId){
                $newFileName = strtolower($fileName);

                  return "{$transId}/{$newFileName}";
            }, $fileNames);
           
            Storage::disk(self::EXCEL_DISK)->delete($arrayFiles);
        }
    }
}
