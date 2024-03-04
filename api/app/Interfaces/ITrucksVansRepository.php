<?php

namespace App\Interfaces;

interface ITrucksVansRepository
{
    public function getTrucksVansStatus($customerCode);

    public function getTrucksVansStatusDetails($searchVal, $customerCode, $action);

    public function getScheduleToday($customerCode);

    public function createNotices($request);

    public function deleteNotices($customerCode, $phoneNum);
}
