<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use App\Interfaces\IInventoryRepository;

class InventoryExport implements FromArray, Withheadings, ShouldAutoSize
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
    public function array(): array
    {
        $result = $this->inventoryExport->getStocksInventory($this->customerCode, $this->warehouseNo, "material");

        return count($result) ? $result : [];
    }

    public function headings(): array
    {
        return [
            "Material code",
            "Description",
            "Total available",
            "Allocated stocks",
            "Blocked stocks",
            "Restricted stocks"
        ];
    }
}
