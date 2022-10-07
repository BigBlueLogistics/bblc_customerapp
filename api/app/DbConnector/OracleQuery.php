<?php

namespace App\DbConnector;

use Exception;

class OracleQuery
{
    public static function select($query)
    {
        if (empty($query)) {
            throw new Exception('Empty query');
        }
        try {
            $inst = new OracleConn();
            $conn = $inst->getConnection();

            $stid = oci_parse($conn, $query);

            oci_execute($stid);
            $row = oci_fetch_array($stid, OCI_ASSOC + OCI_RETURN_NULLS);

            // oci_free_statement($stid);
            return $row;
        } catch (Exception $e) {
            throw new Exception($e->getMessage());
        }
    }
}
