<?php

namespace App\DbConnector;

use Exception;

define('DB_ORACLE_USERNAME', env('DB_ORACLE_USERNAME'));
define('DB_ORACLE_PASSWORD', env('DB_ORACLE_PASSWORD'));
define('DB_ORACLE_HOST', env('DB_ORACLE_HOST'));
define('DB_ORACLE_PORT', env('DB_ORACLE_PORT'));
define('DB_ORACLE_SERVICE_NAME', env('DB_ORACLE_SERVICE_NAME'));

class OracleConn
{
    private $DB_ORACLE_USERNAME = DB_ORACLE_USERNAME;

    private $DB_ORACLE_PASSWORD = DB_ORACLE_PASSWORD;

    private $DB_ORACLE_HOST = DB_ORACLE_HOST;

    private $DB_ORACLE_PORT = DB_ORACLE_PORT;

    private $DB_ORACLE_SERVICE_NAME = DB_ORACLE_SERVICE_NAME;

    private $dbConnection;

    public function __construct()
    {
        $this->initConnection();
    }

    private function initConnection()
    {
        try {
            // Default to persistent connection for performance enhancement
            if (function_exists('oci_pconnect')) {
                $conn = oci_pconnect($this->DB_ORACLE_USERNAME, $this->DB_ORACLE_PASSWORD, "//{$this->DB_ORACLE_HOST}:{$this->DB_ORACLE_PORT}/{$this->DB_ORACLE_SERVICE_NAME}");
            } else {
                $conn = oci_connect($this->DB_ORACLE_USERNAME, $this->DB_ORACLE_PASSWORD, "//{$this->DB_ORACLE_HOST}:{$this->DB_ORACLE_PORT}/{$this->DB_ORACLE_SERVICE_NAME}");
            }

            if (! $conn) {
                return 'test';
                $err = oci_error($conn);
                trigger_error(htmlentities($err['message'], ENT_QUOTES), E_USER_ERROR);
            }

            // Pass the connection objects
            $this->dbConnection = $conn;
        } catch (Exception $e) {
            throw new Exception('Database connection error '.$e->getMessage());
        }
    }

    public function getConnection()
    {
        return $this->dbConnection;
    }

    public function __destruct()
    {
        oci_close($this->dbConnection);
    }
}
