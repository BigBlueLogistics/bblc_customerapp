<?php

namespace App\Http\Controllers\WAREHOUSE;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

use App\DbConnector\SapS4Conn as SapS4;
use App\Facades\SapRfcFacade;
use App\Traits\HttpResponse;
use App\Interfaces\IInventoryRepository;
use App\Exports\InventoryExport;

class InventoryController extends Controller
{
    use HttpResponse;

    private $inventory;

    public function __construct(IInventoryRepository $inventory)
    {
        $this->inventory = $inventory;
    }

    public function warehouseList()
    {
        $mandt = SapRfcFacade::getMandt();
        $res = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
            ->param('QUERY_TABLE', 'T001W')
            ->param('DELIMITER', ';')
            ->param('OPTIONS', [
                ['TEXT' => "MANDT = {$mandt}"],
                ['TEXT' => " AND WERKS LIKE 'BB%'"],
            ])
            ->param('FIELDS', [
                ['FIELDNAME' => 'WERKS'],
                ['FIELDNAME' => 'NAME1'],
            ])
            ->getDataToArray();

        $wh = array_map(function ($value) {
            $arr['PLANT'] = $value['WERKS'];
            $arr['NAME1'] = $value['NAME1'];

            return $arr;
        }, $res);

        return $this->sendResponse($wh, 'List of warehouse');
    }

    public function getMCHB($customerCode, $warehouse, $server)
    {
        $c = SapS4::connect($server, 'Local');
        $mandt = SapS4::getMandt();
        $f = $c->getFunction('ZFM_BBP_RFC_READ_TABLE');

        $options = [
            ['TEXT' => "MANDT EQ  '".$mandt."'"],
            ['TEXT' => " AND MATNR LIKE '".$customerCode."%'"],
            ['TEXT' => " AND WERKS EQ '".$warehouse."'"],
            ['TEXT' => ' AND (CLABS > 0'],
            ['TEXT' => ' OR CINSM > 0'],
            ['TEXT' => ' OR CSPEM > 0)'],
        ];
        $fields = [
            ['FIELDNAME' => 'MATNR'],
            ['FIELDNAME' => 'CLABS'],
            ['FIELDNAME' => 'CINSM'],
            ['FIELDNAME' => 'CSPEM'],
            ['FIELDNAME' => 'CHARG'],
        ];

        $rowMCHB = $f->invoke([
            'QUERY_TABLE' => 'MCHB',
            'OPTIONS' => $options,
            'FIELDS' => $fields,
            'DELIMITER' => ';',
            'ORDER_BY_COLUMN' => '2', // 2 = DESC , 1 = ASC
            'SORT_FIELDS' => 'MATNR',
        ]);

        $c->close();

        return $rowMCHB;
    }

    public function getMAKT($customerCode, $server)
    {
        $c = SapS4::connect($server, 'Local');
        $mandt = SapS4::getMandt();

        $f = $c->getFunction('ZFM_BBP_RFC_READ_TABLE');

        $options = [
            ['TEXT' => "MANDT EQ '{$mandt}'"],
            ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
        ];
        $fields = [
            ['FIELDNAME' => 'MATNR'],
            ['FIELDNAME' => 'MAKTX'],
        ];

        $rowMAKT = $f->invoke([
            'QUERY_TABLE' => 'MAKT',
            'OPTIONS' => $options,
            'FIELDS' => $fields,
            'DELIMITER' => ';',
        ]);

        $c->close();

        return $rowMAKT;
    }

    public function getMKVE($customerCode, $server)
    {
        $c = SapS4::connect($server, 'Local');
        $mandt = SapS4::getMandt();
        $f = $c->getFunction('ZFM_BBP_RFC_READ_TABLE');

        $options = [
            ['TEXT' => "MANDT EQ '{$mandt}'"],
            ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
            ['TEXT' => " AND VRKME NE 'KG'"],
        ];
        $fields = [
            ['FIELDNAME' => 'MATNR'],
            ['FIELDNAME' => 'VRKME'],
        ];

        $rowMVKE = $f->invoke([
            'QUERY_TABLE' => 'MVKE',
            'OPTIONS' => $options,
            'FIELDS' => $fields,
            'DELIMITER' => ';',
        ]);

        $c->close();

        return $rowMVKE;
    }

    public function getMARA($customerCode, $server)
    {
        $c = SapS4::connect($server, 'Local');
        $mandt = SapS4::getMandt();
        $f = $c->getFunction('ZFM_BBP_RFC_READ_TABLE');

        $options = [
            ['TEXT' => "MANDT EQ '{$mandt}'"],
            ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
        ];
        $fields = [
            ['FIELDNAME' => 'MATNR'],
            ['FIELDNAME' => 'MATKL'],
            ['FIELDNAME' => 'MAGRV'],
            ['FIELDNAME' => 'NORMT'],
            ['FIELDNAME' => 'ERNAM'],
            ['FIELDNAME' => 'ERSDA'],
            ['FIELDNAME' => 'LAEDA'],
            ['FIELDNAME' => 'SCM_MATID_GUID16'],
        ];

        $rowMARA = $f->invoke([
            'QUERY_TABLE' => 'MARA',
            'OPTIONS' => $options,
            'FIELDS' => $fields,
            'DELIMITER' => ';',
        ]);

        $c->close();

        return $rowMARA;
    }

    public function getMARM($customerCode, $server)
    {
        $c = SapS4::connect($server, 'Local');
        $mandt = SapS4::getMandt();
        $f = $c->getFunction('ZFM_BBP_RFC_READ_TABLE');

        $options = [
            ['TEXT' => "MANDT EQ '{$mandt}'"],
            ['TEXT' => " AND MATNR LIKE '{$customerCode}%'"],
        ];
        $fields = [
            ['FIELDNAME' => 'MATNR'],
            ['FIELDNAME' => 'MEINH'],
            ['FIELDNAME' => 'UMREZ'],
            ['FIELDNAME' => 'UMREN'],
            ['FIELDNAME' => 'VOLUM'],
            ['FIELDNAME' => 'VOLEH'],
            ['FIELDNAME' => 'EAN11'],
        ];

        $getMARM = $f->invoke([
            'QUERY_TABLE' => 'MARM',
            'OPTIONS' => $options,
            'FIELDS' => $fields,
            'DELIMITER' => ';',
        ]);

        // close sap connection;
        $c->close();

        return $getMARM;
    }

    public function getMCH1($material, $batch, $server)
    {
        $c = SapS4::connect($server, 'Local');
        $mandt = SapS4::getMandt();
        $f = $c->getFunction('ZFM_BBP_RFC_READ_TABLE');

        $options = [
            ['TEXT' => "MANDT EQ '{$mandt}'"],
            ['TEXT' => " AND MATNR EQ '{$material}'"],
            ['TEXT' => " AND CHARG EQ '{$batch}'"],
        ];
        $fields = [
            ['FIELDNAME' => 'VFDAT'],
            ['FIELDNAME' => 'HSDAT'],
        ];

        $rowMCH1 = $f->invoke([
            'QUERY_TABLE' => 'MCH1',
            'OPTIONS' => $options,
            'FIELDS' => $fields,
            'DELIMITER' => ';',
        ]);

        $c->close();

        return $rowMCH1;
    }

    public function export(Request $request)
    {
        $customerCode = $request->input('customer_code');
        $warehouse = $request->input('warehouse');

        $export = new InventoryExport($this->inventory);
        $export->setFilterBy($customerCode, $warehouse);

        return Excel::download($export, 'stocks.xlsx');
    }

    public function table(Request $request)
    {
        try {
            $customerCode = $request->input('customer_code');
            $warehouse = $request->input('warehouse');
            $groupBy = $request->input('group_by');

            $res = $this->inventory->getStocksInventory($customerCode, $warehouse, $groupBy);

            return $this->sendResponse($res);
        } catch (SapException $ex) {
            return $this->sendError($ex, 500);
        }
    }

    public function table2(Request $request)
    {
        try {
            $customerCode = $request->input('customer_code');
            $warehouse = $request->input('warehouse');
            $server = $request->input('server');
            $groupBy = $request->input('group_by');

            $rowMCHB = $this->getMCHB($customerCode, $warehouse, $server);
            $rowMAKT = $this->getMAKT($customerCode, $server);
            $rowMKVE = $this->getMKVE($customerCode, $server);
            $rowMARA = $this->getMARA($customerCode, $server);
            $rowMARM = $this->getMARM($customerCode, $server);

            $maktx = '';
            $meinh = '';
            $umren = 0;
            $umrez = 0;

            $output = [];
            for ($iMCHB = 0; $iMCHB <= count($rowMCHB['DATA']) - 1; $iMCHB++) {
                // Material code
                $mchb = explode(';', $rowMCHB['DATA'][$iMCHB]['WA']);
                $matnr = trim($mchb[0]);

                for ($iMAKT = 0; $iMAKT <= count($rowMAKT['DATA']) - 1; $iMAKT++) {
                    // Material description
                    $makt = explode(';', $rowMAKT['DATA'][$iMAKT]['WA']);

                    if ($matnr == trim($makt[0])) {
                        $maktx = $makt[1];
                        break;
                    }
                }

                for ($iMKVE = 0; $iMKVE <= count($rowMKVE['DATA']) - 1; $iMKVE++) {
                    // Sales unit
                    $makve = explode(';', $rowMKVE['DATA'][$iMKVE]['WA']);

                    if ($matnr == trim($makve[0])) {
                        $meinh = $makve[1];
                        break;
                    }
                }

                if ($meinh == '') {
                    $meinh = 'kg';
                    $umrez = 1;
                    $umren = 1;
                } else {
                    for ($iMARM = 0; $iMARM <= count($rowMARM['DATA']) - 1; $iMARM++) {
                        // Unit of measure
                        $marm = explode(';', $rowMARM['DATA'][$iMARM]['WA']);

                        if ($matnr == trim($marm[0])) {
                            if (trim($meinh) == trim($marm[1])) {
                                $umrez = $marm[2];
                                $umren = $marm[3];
                            }
                        }
                    }
                }

                if ($groupBy === 'material') {
                    // Unique material code, and sum up clabs, cinsm and cspem
                    if (array_key_exists($matnr, $output)) {
                        $output[$matnr]['clabs'] += floatval($mchb[1]);
                        $output[$matnr]['cinsm'] += floatval($mchb[2]);
                        $output[$matnr]['cspem'] += floatval($mchb[3]);
                    } else {
                        $output[$matnr]['matnr'] = $matnr;
                        $output[$matnr]['makt'] = trim($maktx);
                        $output[$matnr]['meinh'] = trim($meinh);
                        $output[$matnr]['umrez'] = trim($umrez);
                        $output[$matnr]['umren'] = trim($umren);
                        $output[$matnr]['clabs'] = floatval($mchb[1]);
                        $output[$matnr]['cinsm'] = floatval($mchb[2]);
                        $output[$matnr]['cspem'] = floatval($mchb[3]);
                    }
                } elseif ($groupBy === 'batch') {
                    $output[$iMCHB] = [
                        'matnr' => $matnr,             // material
                        'makt' => trim($maktx),        // description
                        'meinh' => trim($meinh),
                        'umrez' => trim($umrez),
                        'umren' => trim($umren),
                        'clabs' => floatval($mchb[1]),  // putaway
                        'cinsm' => floatval($mchb[2]),  // allocated
                        'cspem' => floatval($mchb[3]),  // available
                        'charg' => trim($mchb[4]),
                    ];
                } else {
                    $rowMCH1 = $this->getMCH1($matnr, trim($mchb[4]), $server);
                    $mch1 = explode(';', $rowMCH1['DATA'][0]['WA']);
                    $vfdat = trim($mch1[0]);

                    if (! empty($vfdat)) {
                        $date = date_create($vfdat);
                        $vfdat_format = date_format($date, 'm/d/Y');
                    } else {
                        $vfdat_format = 000000000;
                    }

                    $output[$iMCHB] = [
                        'matnr' => $matnr,             // material
                        'makt' => trim($maktx),        // description
                        'meinh' => trim($meinh),
                        'umrez' => trim($umrez),
                        'umren' => trim($umren),
                        'clabs' => floatval($mchb[1]),  // putaway
                        'cinsm' => floatval($mchb[2]),  // allocated
                        'cspem' => floatval($mchb[3]),  // available
                        'vfdat' => $vfdat_format,        // expiry
                    ];
                }
            }
            $result = $groupBy === 'material' ? array_values($output) : $output;

            return $this->sendResponse($result, 'inventory details');
        } catch (SapException $ex) {
            return $this->sendError('Exception: '.$ex->getMessage().PHP_EOL);
        }
    }
}
