<?php

namespace App\Interfaces;

use DateTime;

interface IMovementRepository
{
    public function outboundMov($materialCode, $fromDate, $toDate, $warehouseNo, $customerCode, $generateType);
    public function outboundMovExcel($data);
    public function inboundMov($materialCode, $fromDate, $toDate, $warehouseN, $customerCode);
   /**
    * Merge the result of inbound and outbound
    * @param [enum] $generateType = "table" | "excel"
    */
    public function mergeInOutbound($materialCode, $fromDate,  $toDate, $warehouseNo, $customerCode, $generateType);
    public function outboundSubDetails($documentNo, $documentNoRef);
    public function materialAndDescription($customerCode);
}