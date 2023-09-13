<?php

namespace App\Interfaces;

interface IOrderRepository
{
    public function materialAndDescription($customerCode, $warehouseNo);

    public function productUnits($materialCode);

    public function expiryBatch($customerCode, $warehouseNo);
}
