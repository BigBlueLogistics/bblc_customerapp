<?php

namespace App\Http\Controllers\WAREHOUSE;

use App\Http\Controllers\API\BaseController;
use Illuminate\Http\Request;

use App\DbConnector\SapS4Conn as SapS4;

class InventoryController extends BaseController
{
    
    function warehouseList(Request $request)
    {
        $server = $request->input('server');

        $c = SapS4::connect($server, 'Local');
        $mandt = SapS4::getMandt();

        $f = $c->getFunction('ZFM_BBP_RFC_READ_TABLE');
        $options=array(
            array("TEXT" => "MANDT = {$mandt}" ),
            array("TEXT" => " AND WERKS LIKE 'BB%'"),
        );
        $fields=array(
            array("FIELDNAME" => "WERKS"),
            array("FIELDNAME" => "NAME1"),
        );

        $row = $f->invoke([
            'QUERY_TABLE' => 'T001W',
            'OPTIONS' => $options,
            'FIELDS' => $fields,
        ]);
    
        $output = array();
        for($x=0;$x <= count($row['DATA'])-1;$x++){
            $arrinfo=array(
                'PLANT' => trim(substr($row['DATA'][$x]['WA'],0,4)),
                'NAME1' => trim(substr($row['DATA'][$x]['WA'], 4, strlen($row['DATA'][$x]['WA'])-4)),
            );
            array_push($output,$arrinfo);
        }
        
        return $this->sendResponse("List of warehouse", $output);
    }

    function getMCHB($customerCode, $warehouse, $server)
    {
        $c = SapS4::connect($server, 'Local');
        $mandt = SapS4::getMandt();
        $f = $c->getFunction('ZFM_BBP_RFC_READ_TABLE');

        $options=array(
            array("TEXT" => "MANDT EQ  '".$mandt."'"),
            array("TEXT" => " AND MATNR LIKE '".$customerCode."%'"),
            array("TEXT" => " AND WERKS EQ '".$warehouse."'"),
            array("TEXT" => " AND (CLABS > 0"),
            array("TEXT" => " OR CINSM > 0"),
            array("TEXT" => " OR CSPEM > 0)"),
        );
        $fields=array(
            array("FIELDNAME" => "MATNR"),
            array("FIELDNAME" => "CLABS"),
            array("FIELDNAME" => "CINSM"),
            array("FIELDNAME" => "CSPEM"),
            array("FIELDNAME" => "CHARG"),
        );

        $rowMCHB = $f->invoke([
            'QUERY_TABLE' => 'MCHB',
            'OPTIONS' => $options,
            'FIELDS' => $fields,
            'DELIMITER' => ";",
            'ORDER_BY_COLUMN' => "2", // 2 = DESC , 1 = ASC
            'SORT_FIELDS' => "MATNR"
        ]);

        $c->close();
        return $rowMCHB;
    }

    function getMAKT($customerCode, $server)
    {
        $c = SapS4::connect($server, 'Local');
        $mandt = SapS4::getMandt();
        
        $f = $c->getFunction('ZFM_BBP_RFC_READ_TABLE');

        $options=array(
            array("TEXT" => "MANDT EQ '{$mandt}'"),
            array("TEXT" => " AND MATNR LIKE '{$customerCode}%'"),
        );
        $fields=array(
            array("FIELDNAME" => "MATNR"),
            array("FIELDNAME" => "MAKTX"),
        );

        $rowMAKT = $f->invoke([
            'QUERY_TABLE' => 'MAKT',
            'OPTIONS' => $options,
            'FIELDS' => $fields,
            'DELIMITER' => ";",
        ]);

        $c->close();
        return $rowMAKT;
    }

    function getMKVE($customerCode, $server)
    {
        $c = SapS4::connect($server, 'Local');
        $mandt = SapS4::getMandt();
        $f = $c->getFunction('ZFM_BBP_RFC_READ_TABLE');

        $options=array(
            array( "TEXT" => "MANDT EQ '{$mandt}'"),
            array( "TEXT" => " AND MATNR LIKE '{$customerCode}%'"),
            array( "TEXT" => " AND VRKME NE 'KG'"),
        );
        $fields=array(
            array("FIELDNAME" => "MATNR"),
            array("FIELDNAME" => "VRKME"),
        );

        $rowMVKE = $f->invoke([
            'QUERY_TABLE' => 'MVKE',
            'OPTIONS' => $options,
            'FIELDS' => $fields,
            'DELIMITER' => ";",
        ]);

        $c->close();
        return $rowMVKE;
    }

    function getMARA($customerCode, $server)
    {
        $c = SapS4::connect($server, 'Local');
        $mandt = SapS4::getMandt();
        $f = $c->getFunction('ZFM_BBP_RFC_READ_TABLE');

        $options=array(
            array("TEXT" => "MANDT EQ '{$mandt}'"),
            array("TEXT" => " AND MATNR LIKE '{$customerCode}%'"),
        );
        $fields=array(
            array("FIELDNAME" => "MATNR"),
            array("FIELDNAME" => "MATKL"),
            array("FIELDNAME" => "MAGRV"),
            array("FIELDNAME" => "NORMT"),
            array("FIELDNAME" => "ERNAM"),
            array("FIELDNAME" => "ERSDA"),
            array("FIELDNAME" => "LAEDA"),
            array("FIELDNAME" => "SCM_MATID_GUID16"),
        );

        $rowMARA = $f->invoke([
            'QUERY_TABLE' => 'MARA',
            'OPTIONS' => $options,
            'FIELDS' => $fields,
            'DELIMITER' => ";",
        ]);

        $c->close();

        return $rowMARA;
    }

    function getMARM($customerCode, $server)
    {
        $c = SapS4::connect($server, 'Local');
        $mandt = SapS4::getMandt();
        $f = $c->getFunction('ZFM_BBP_RFC_READ_TABLE');

        $options=array(
            array("TEXT" => "MANDT EQ '{$mandt}'"),
            array("TEXT" => " AND MATNR LIKE '{$customerCode}%'"),
        );
        $fields=array(
            array("FIELDNAME" => "MATNR"),
            array("FIELDNAME" => "MEINH"),
            array("FIELDNAME" => "UMREZ"),
            array("FIELDNAME" => "UMREN"),
            array("FIELDNAME" => "VOLUM"),
            array("FIELDNAME" => "VOLEH"),
            array("FIELDNAME" => "EAN11"),
        );

        $getMARM = $f->invoke([
            'QUERY_TABLE' => 'MARM',
            'OPTIONS' => $options,
            'FIELDS' => $fields,
            'DELIMITER' => ";",
        ]);

        // close sap connection;
        $c->close();

        return $getMARM;
    }

    function getMCH1($material, $batch, $server)
    {
        $c = SapS4::connect($server, 'Local');
        $mandt = SapS4::getMandt();
        $f = $c->getFunction('ZFM_BBP_RFC_READ_TABLE');

        $options=array(
            array( "TEXT" => "MANDT EQ '{$mandt}'"),
            array( "TEXT" => " AND MATNR EQ '{$material}'"),
            array( "TEXT" => " AND CHARG EQ '{$batch}'"),
        );
        $fields=array(
            array("FIELDNAME" => "VFDAT"),
            array("FIELDNAME" => "HSDAT"),
        );

        $rowMCH1 = $f->invoke([
            'QUERY_TABLE' => 'MCH1',
            'OPTIONS' => $options,
            'FIELDS' => $fields,
            'DELIMITER' => ";",
        ]);

        $c->close();
        return $rowMCH1;
    }



    function table(Request $request)
    {
        try
        {
            $customerCode = $request->input('customer_code');
            $warehouse = $request->input('warehouse'); 
            $server = $request->input('server');
            $groupBy = $request->input('group_by');
           
            $rowMCHB = $this->getMCHB($customerCode, $warehouse, $server);
            $rowMAKT = $this->getMAKT($customerCode, $server);
            $rowMKVE = $this->getMKVE($customerCode, $server);
            $rowMARA = $this->getMARA($customerCode, $server);
            $rowMARM = $this->getMARM($customerCode, $server);

            $maktx = "";
            $meinh = "";
            $umren = 0;
            $umrez = 0;

            $output = array();
            for ($iMCHB=0; $iMCHB <= count($rowMCHB["DATA"]) - 1 ; $iMCHB++) 
            { 
                // Material code
               $mchb = explode(";", $rowMCHB["DATA"][$iMCHB]["WA"]);
               $matnr = trim($mchb[0]);

                for ($iMAKT=0; $iMAKT <= count($rowMAKT["DATA"]) - 1 ; $iMAKT++) { 
                   // Material description
                    $makt = explode(";", $rowMAKT["DATA"][$iMAKT]["WA"]);

                    if($matnr == trim($makt[0])){
                        $maktx = $makt[1];
                        break;
                    }
                } 
               
                for ($iMKVE=0; $iMKVE <= count($rowMKVE["DATA"]) - 1; $iMKVE++) 
                {    

                  // Sales unit
                    $makve = explode(";", $rowMKVE["DATA"][$iMKVE]["WA"]);

                    if($matnr == trim($makve[0])){
                        $meinh = $makve[1];
                        break;
                    }                   
                }

                if($meinh == "")
                {
                    $meinh = "kg";
                    $umrez = 1;
                    $umren = 1;
                }
                else
                {
                    for ($iMARM=0; $iMARM <= count($rowMARM["DATA"]) - 1 ; $iMARM++) 
                    {   
                        // Unit of measure
                         $marm = explode(";", $rowMARM["DATA"][$iMARM]["WA"]);
     
                         if($matnr == trim($marm[0]) ){

                            if(trim($meinh) == trim($marm[1])){
                                
                                $umrez = $marm[2];
                                $umren = $marm[3];
                            }                              
                         }
                         
                     }
                }

                if($groupBy === "material")
                {
                    // Unique material code, and sum up clabs, cinsm and cspem
                    if(array_key_exists($matnr, $output) ){
                        $output[$matnr]["clabs"] += floatval($mchb[1]);
                        $output[$matnr]["cinsm"] += floatval($mchb[2]);
                        $output[$matnr]["cspem"] += floatval($mchb[3]);
                    }
                    else{
                        $output[$matnr]["matnr"] = $matnr;
                        $output[$matnr]["makt"] = trim($maktx);
                        $output[$matnr]["meinh"] = trim($meinh);
                        $output[$matnr]["umrez"] = trim($umrez);
                        $output[$matnr]["umren"] = trim($umren);
                        $output[$matnr]["clabs"] = floatval($mchb[1]);
                        $output[$matnr]["cinsm"] = floatval($mchb[2]);
                        $output[$matnr]["cspem"] = floatval($mchb[3]);                      
                    }
                }
                else if ($groupBy === "batch")
                {
                    $output[$iMCHB] = array(                        
                        "matnr" =>  $matnr,             // material
                        "makt"  => trim($maktx),        // description
                        "meinh" => trim($meinh),
                        "umrez" => trim($umrez),
                        "umren" => trim($umren),
                        "clabs" => floatval($mchb[1]),  // putaway
                        "cinsm" => floatval($mchb[2]),  // allocated
                        "cspem" => floatval($mchb[3]),  // available
                        "charg" => trim($mchb[4]),
                    ); 
                }
                else
                {
                    $rowMCH1 = $this->getMCH1($matnr, trim($mchb[4]), $server);
                    $mch1 = explode(";", $rowMCH1["DATA"][0]["WA"]);
                    $vfdat = trim($mch1[0]);

                    if(!empty($vfdat)){
                        $date = date_create($vfdat);
                        $vfdat_format = date_format($date, "m/d/Y");
                    }
                    else{
                        $vfdat_format = 000000000;
                    }

                    $output[$iMCHB] = array(                        
                        "matnr" =>  $matnr,             // material
                        "makt"  => trim($maktx),        // description
                        "meinh" => trim($meinh),
                        "umrez" => trim($umrez),
                        "umren" => trim($umren),
                        "clabs" => floatval($mchb[1]),  // putaway
                        "cinsm" => floatval($mchb[2]),  // allocated
                        "cspem" => floatval($mchb[3]),  // available
                        "vfdat" => $vfdat_format        // expiry
                    ); 
                                                        
                }
                               
            }
            $result = $groupBy === "material" ? array_values($output) : $output;

            return $this->sendResponse("inventory details",  $result);
        } 
        catch(SapException $ex) 
        {
            return $this->sendError('Exception: ' . $ex->getMessage() . PHP_EOL);
        }
     
    }
 
}
