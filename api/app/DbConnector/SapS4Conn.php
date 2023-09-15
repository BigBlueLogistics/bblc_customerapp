<?php

namespace App\DbConnector;

use Exception;
use SAPNWRFC\Connection as SapConnection;
use SAPNWRFC\ConnectionException as SapException;

class SapS4Conn
{
    private static $mandt;

    private static $sap_conn;

    // Disable class for instatiation
    private function __construct()
    {
    }

    public static function connect($server, $connection)
    {
        try {
            $config = self::setConfig($server, $connection);
            $conn = new SapConnection($config);

            self::$sap_conn = $conn;

            return $conn;
        } catch (SapException $ex) {
            throw new Exception('Error connecting to SAP: '.$ex->getMessage().PHP_EOL);
        }
    }

    public static function getMandt()
    {
        if (is_null(self::$sap_conn) || empty(self::$sap_conn)) {
            throw new Exception('SAP Connection should established first');
        }
        if (is_null(self::$mandt) || empty(self::$mandt)) {
            throw new Exception('Mandt is empty');
        }

        return self::$mandt;
    }

    private static function setConfig($server, $connection)
    {
        if ($server == 'prd') {
            if ($connection == 'Local') {
                $config = [
                    'ashost' => '192.168.5.131',
                    'sysid' => 'PRD',
                    'sysnr' => '00',
                    'client' => '888',
                    'user' => 'RFCMANAGER',
                    'passwd' => '2BBLC1234@dmin',
                    'trace' => SapConnection::TRACE_LEVEL_OFF,
                ];
                self::$mandt = '888';
            } else {
                $config = [
                    'ashost' => '192.168.5.131',
                    'sysid' => 'DEV',
                    'sysnr' => '00',
                    'client' => '120',
                    'user' => 'RFCMANAGER',
                    'passwd' => '2BBLC1234@dmin',
                    'saprouter' => '/H/222.127.142.230',
                    'trace' => SapConnection::TRACE_LEVEL_OFF,

                ];
                self::$mandt = '120';
            }
        } elseif ($server == 'dev') {
            if ($connection == 'Local') {
                $config = [
                    'ashost' => '192.168.5.128',
                    'sysid' => 'DEV',
                    'sysnr' => '00',
                    'client' => '120',
                    'user' => 'BBLITMNGR',
                    'passwd' => '2BBLC1234@dmin',
                    'trace' => SapConnection::TRACE_LEVEL_OFF,
                ];
                self::$mandt = '120';
            } else {
                $config = [
                    'ashost' => '192.168.5.128',
                    'sysid' => 'DEV',
                    'sysnr' => '00',
                    'client' => '120',
                    'user' => 'BBLITMNGR',
                    'passwd' => '2BBLC1234@dmin',
                    'saprouter' => '/H/222.127.142.230',
                    'trace' => SapConnection::TRACE_LEVEL_OFF,

                ];
                self::$mandt = '120';
            }
        } else {
            if ($connection == 'Local') {
                $config = [
                    'ashost' => '192.168.5.132',
                    'sysid' => 'QAS',
                    'sysnr' => '00',
                    'client' => '200',
                    'user' => 'EWMMANAGER',
                    'passwd' => 'agsaccess',
                    'trace' => SapConnection::TRACE_LEVEL_OFF,
                ];
                self::$mandt = '200';
            } else {
                $config = [
                    'ashost' => '192.168.5.132',
                    'sysid' => 'QAS',
                    'sysnr' => '00',
                    'client' => '200',
                    'user' => 'EWMMANAGER',
                    'passwd' => 'agsaccess',
                    'saprouter' => '/H/222.127.142.230',
                    'trace' => SapConnection::TRACE_LEVEL_OFF,
                ];
                self::$mandt = '200';
            }
        }

        return $config;
    }
}
