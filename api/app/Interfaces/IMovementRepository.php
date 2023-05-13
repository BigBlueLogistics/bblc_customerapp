<?php

namespace App\Interfaces;


interface IMovementRepository
{
    public function outboundMov($materialCode, $fromDate, $toDate, $warehouseNo);
    public function inboundMov($materialCode, $fromDate, $toDate, $warehouseNo);
}