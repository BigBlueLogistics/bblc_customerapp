<?php

namespace App\Interfaces;

interface IInventoryRepository
{
    public function getStocksInventory($customerCode, $warehouseNo);
}
