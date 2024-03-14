<?php

namespace App\Interfaces;

interface ITrucksVansRepository
{
    public function getTrucksVansStatus($customerCode);

    public function getTrucksVansStatusDetails($searchTerm, $customerCode, $action);

    public function getScheduleToday($customerCode);

    public function createNotices($request);

    public function deleteNotices($customerCode, $phoneNum);

    public function searchTrucksVans($customerCode, $searchTerm);
}
