<?php

namespace App\Support;

use Exception;
use SAPNWRFC\Connection as SapConnection;
use SAPNWRFC\ConnectionException as SapException;

class SapRfc
{

    private static $mandt;
    private static $cached_conn = [];
    private static $hash_config;
    private $sap_conn;
    private $paramaters = [];
    private $fm;

    function __construct($server, $connection)
    {
        try {
            $config = static::setConfig($server, $connection);
            $conn = static::cachedConnection($config, new SapConnection($config));

            $this->sap_conn = $conn;
        } catch (SapException $ex) {
            throw new Exception('Error connecting to SAP: ' . $ex->getMessage() . PHP_EOL);
        }
    }

    private static function cachedConnection($config, $sapInstanceConnection)
    {
        $hash_config = sha1(implode(";", $config));
        static::$hash_config = $hash_config;

        if (array_key_exists($hash_config, static::$cached_conn)) {
            return static::$cached_conn[$hash_config];
        } else {
            return static::$cached_conn[$hash_config] = $sapInstanceConnection;
        }
    }

    function getMandt()
    {
        if (is_null($this->sap_conn) || empty($this->sap_conn)) {
            throw new Exception("SAP Connection should established first");
        }
        if (is_null(static::$mandt) || empty(static::$mandt)) {
            throw new Exception("Mandt is empty");
        }

        return static::$mandt;
    }

    function param($name, $value)
    {

        $name = strtoupper($name);

        if (!isset($name)) {
            throw new Exception("$name paramater not found");
        }

        if (array_key_exists($name, $this->paramaters)) {
            throw new Exception("{$name} param name is already exists.");
        }

        $this->paramaters[$name] = $value;
        return $this;
    }

    function functionModule($name)
    {
        $fm = strtoupper($name);

        $this->fm = $fm;

        return $this;
    }


    function invoke()
    {
        try {
            // Set function to use
            $f = $this->sap_conn->getFunction($this->fm);

            // Invoke and return the result
            $result = $f->invoke($this->paramaters);

            return $result;
        } catch (\SapException $ex) {
            throw new Exception($ex->getMessage() . PHP_EOL);
        }
    }

    function getData()
    {
        $data = $this->invoke();

        $this->reset();

        return $data;
    }

    function getDataToArray()
    {
        $data = $this->invoke();

        $this->reset();

        return $this->transformData($data);
    }

    /** 
     * Transform data to one dimensional arrays
     */
    function transformData($result)
    {
        $data = $result['DATA'] ?? [];
        $fields = $result['FIELDS'] ?? [];

        // If no data early exit.
        if (count($data) === 0) {
            return $data;
        }

        // Data
        $data = array_map(function ($value) {

            $explode_value = explode(";", $value['WA']);

            $trim_data = array_map(function ($value) {
                return trim($value);
            }, $explode_value);

            return $trim_data;
        }, $data);


        // Fields
        $fields = array_map(function ($value) {
            return trim($value['FIELDNAME']);
        }, $fields);


        // Combine array Fields as keys
        // and array Data as values
        $combinedArray = [];
        foreach ($data as  $value) {
            if (count($fields) !== count($value)) {
                $combinedArray[] = [];
            }
            $combinedArray[] = array_combine($fields, $value);
        }

        return $combinedArray;
    }

    /**
     * Clear non-static local variables data
     */
    function reset()
    {

        foreach (get_class_vars(get_class($this)) as $var => $default_val) {

            if (isset($this->$var)) {

                $this->$var = $default_val;
            }
        }
    }

    /** 
     * Close connection
     */
    function close()
    {
        try {
            $this->sap_conn->close();

            // Remove cached connection from array
            unset(static::$cached_conn[static::$hash_config]);

            return $this;
        } catch (\SapException $ex) {
            throw new Exception($ex->getMessage() . PHP_EOL);
        }
    }

    /**
     * Credentials
     */
    private static function setConfig($server, $connection)
    {
        if ($server == 'prd') {
            if ($connection == 'Local') {
                $config = [
                    'ashost' => '192.168.5.131',
                    'sysid'  => 'PRD',
                    'sysnr'  => '00',
                    'client' => '888',
                    'user'   => 'RFCMANAGER',
                    'passwd' => '2BBLC1234@dmin',
                    'trace'  => SapConnection::TRACE_LEVEL_OFF,
                ];
                static::$mandt = '888';
            } else {
                $config = [
                    'ashost' => '192.168.5.131',
                    'sysid'  => 'DEV',
                    'sysnr'  => '00',
                    'client' => '120',
                    'user'   => 'RFCMANAGER',
                    'passwd' => '2BBLC1234@dmin',
                    'saprouter' => '/H/222.127.142.230',
                    'trace'  => SapConnection::TRACE_LEVEL_OFF,

                ];
                static::$mandt = '120';
            }
        } else if ($server == 'dev') {

            if ($connection == 'Local') {
                $config = [
                    'ashost' => '192.168.5.128',
                    'sysid'  => 'DEV',
                    'sysnr'  => '00',
                    'client' => '120',
                    'user'   => 'BBLITMNGR',
                    'passwd' => '2BBLC1234@dmin',
                    'trace'  => SapConnection::TRACE_LEVEL_OFF,
                ];
                static::$mandt = '120';
            } else {
                $config = [
                    'ashost' => '192.168.5.128',
                    'sysid'  => 'DEV',
                    'sysnr'  => '00',
                    'client' => '120',
                    'user'   => 'BBLITMNGR',
                    'passwd' => '2BBLC1234@dmin',
                    'saprouter' => '/H/222.127.142.230',
                    'trace'  => SapConnection::TRACE_LEVEL_OFF,

                ];
                static::$mandt = '120';
            }
        } else {

            if ($connection == 'Local') {
                $config = [
                    'ashost' => '192.168.5.132',
                    'sysid'  => 'QAS',
                    'sysnr'  => '00',
                    'client' => '200',
                    'user'   => 'EWMMANAGER',
                    'passwd' => 'agsaccess',
                    'trace'  => SapConnection::TRACE_LEVEL_OFF,
                ];
                static::$mandt = '200';
            } else {
                $config = [
                    'ashost' => '192.168.5.132',
                    'sysid'  => 'QAS',
                    'sysnr'  => '00',
                    'client' => '200',
                    'user'   => 'EWMMANAGER',
                    'passwd' => 'agsaccess',
                    'saprouter' => '/H/222.127.142.230',
                    'trace'  => SapConnection::TRACE_LEVEL_OFF,
                ];
                static::$mandt = '200';
            }
        }
        return $config;
    }
}