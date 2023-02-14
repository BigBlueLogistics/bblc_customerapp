<?php

namespace App\Interfaces;

interface IOrderRepository
{
    public function materialAndDescription($customerCode);
    public function productUnits($materialCode);
    public function expiryBatch($customerCode, $warehouseNo);
}
