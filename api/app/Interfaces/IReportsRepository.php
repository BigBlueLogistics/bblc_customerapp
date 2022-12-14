<?php

namespace App\Interfaces;

interface IReportsRepository
{
    public function getWhSnapshot($customerCode, $warehouseNo, $groupBy);
    public function getStocks($customerCode, $warehouseNo, $startDate, $endDate);
}
