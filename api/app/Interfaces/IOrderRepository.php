<?php

namespace App\Interfaces;

interface IOrderRepository
{
    public function materialAndDescription($customerCode, $warehouseNo);

    public function productUnits($materialCode);

    public function expiryBatch($customerCode, $warehouseNo);

    public function readText($docNo);
    
    public function adhocDetails($customerCode, $docNo);

    public function createAdhocRequest($data);
}
