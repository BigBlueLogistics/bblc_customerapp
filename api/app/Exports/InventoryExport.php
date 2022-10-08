<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use App\Interfaces\IInventoryRepository;

class InventoryExport implements FromCollection
{
    private $inventoryExport;
    private $customerCode;
    private $warehouseNo;

    public function __construct(IInventoryRepository $inventory)
    {
        $this->inventoryExport = $inventory;
    }

    public function setFilterBy($customerCode, $warehouseNo)
    {
        $this->customerCode = $customerCode;
        $this->warehouseNo = $warehouseNo;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $result = $this->inventoryExport->getStocksInventory($this->customerCode, $this->warehouseNo);

        $values = array_values($result);

        return count($values) ? collect($values[0]) : [];
    }
}
