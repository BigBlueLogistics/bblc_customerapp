<?php

namespace App\Repository;

use App\Interfaces\IInventoryRepository;
use App\Facades\SapRfcFacade;
use App\Traits\StringEncode;

class InventoryRepository implements IInventoryRepository
{
    use StringEncode;

    public function getStocksInventory($customerCode, $warehouseNo)
    {
        $result = SapRfcFacade::functionModule('ZFM_EWM_TABLEREAD')
            ->param('IV_CUSTOMER', $customerCode)
            ->param('IV_WAREHOUSENO', $warehouseNo)
            ->getData();

        return $this->convert_latin1_to_utf8_recursive($result);
    }
}
