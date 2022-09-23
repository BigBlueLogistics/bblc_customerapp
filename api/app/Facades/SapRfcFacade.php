<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class SapRfcFacade extends Facade
{
    protected static $cached = false;

    public static function getFacadeAccessor()
    {
        return 'sap-rfc';
    }
}
