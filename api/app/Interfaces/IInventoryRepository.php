<?php

namespace App\Interfaces;

interface IInventoryRepository
{
    public function getStocksInventory($customerCode, $warehouseNo);

    public function getAllocatedStocks($customerCode, $warehouseNo);
}
