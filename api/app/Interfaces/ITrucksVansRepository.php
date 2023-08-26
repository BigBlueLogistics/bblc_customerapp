<?php

namespace App\Interfaces;

interface ITrucksVansRepository
{
    public function getTrucksVansStatus($customerCode);
    public function getTrucksVansStatusDetails($vanMonitorNo, $customerCode);
}