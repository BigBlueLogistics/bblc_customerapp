<?php

namespace App\Interfaces;


interface IMovementRepository
{
    public function outboundMov($materialCode, $fromDate, $toDate, $warehouseNo, $customerCode);
    public function inboundMov($materialCode, $fromDate, $toDate, $warehouseN, $customerCode);
    public function mergeInOutbound($materialCode, $fromDate, $toDate, $warehouseNo, $customerCode);
    public function outboundSubDetails($documentNo, $documentNoRef);
    public function materialAndDescription($customerCode);
}