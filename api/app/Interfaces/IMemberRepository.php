<?php

namespace App\Interfaces;

interface IMemberRepository
{
    public function getMemberInfo($customerCode);

    public function createInventoryReport($data);
}
