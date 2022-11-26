<?php

namespace App\Interfaces;

interface IReportsRepository
{
    public function getStocksInventory($customerCode, $warehouseNo, $groupBy);
}
