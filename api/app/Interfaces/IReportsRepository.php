<?php

namespace App\Interfaces;

interface IReportsRepository
{
    public function getWhSnapshot($customerCode, $warehouseNo, $groupBy);

    public function getStocks($customerCode, $warehouseNo, $startDate, $endDate);

    public function agingBy($customerCode, $warehouseNo, $groupBy);

    public function getAging($customerCode, $warehouseNo, $groupBy);

    public function scheduleInventory($customerCode, $freqy, $invty1, $invty2, $invty3, $time1, $time2, $time3);
}
