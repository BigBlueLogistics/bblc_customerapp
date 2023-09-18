<?php

namespace App\Interfaces;

interface IIndicatorsRepository
{
    public function getInboundOutboundWt($customerCode);

    public function getInboundOutboundTxn($customerCode);

    public function getActiveSku($customerCode, $date);
}
