<?php

namespace App\Interfaces;

interface IIndicatorsRepository 
{

    public function getInboundOutbound($customerCode);
    public function getActiveSku($customerCode);
}