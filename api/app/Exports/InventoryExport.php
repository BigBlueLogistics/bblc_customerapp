<?php

namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\RegistersEventListeners;
use Maatwebsite\Excel\Events\AfterSheet;
use Maatwebsite\Excel\Concerns\WithDrawings;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

use App\Interfaces\IInventoryRepository;
use Carbon\Carbon;

class InventoryExport implements FromView, ShouldAutoSize, WithEvents, WithDrawings
{
    use RegistersEventListeners;

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

    public function view(): View
    {
        $result = $this->inventoryExport->getStocksInventory($this->customerCode, $this->warehouseNo, "material");

        $stocks = count($result) ? $result : [];

        $dateTimeNow = Carbon::now();
        return view('exports.inventory', [
            'stocks' => $stocks,
            'warehouseNo' => $this->warehouseNo,
            'dateNow' => $dateTimeNow->format('m/d/Y'),
            'timeNow' => $dateTimeNow->format('h:i:s A')
        ]);
    }

    public function drawings()
    {
        $drawing = new Drawing();
        $drawing->setName('BBLC logo');
        $drawing->setDescription('BBLC logo');
        $drawing->setPath(public_path('/images/bblc-logo.jpg'));
        $drawing->setWidth(350);
        $drawing->setHeight(70);
        $drawing->setCoordinates('A1');

        return $drawing;
    }

    public static function afterSheet(AfterSheet $event)
    {
        $activeSheet = $event->sheet->getDelegate();
        // Headings label
        $activeSheet->getStyle('A5:A8')->getFont()->setBold(true);
        $activeSheet->getStyle('G5:G8')->getFont()->setBold(true);

        // Label: Warehouse stocks.
        $activeSheet->mergeCells('A8:I8')->getStyle('A8:I8')->getFont()->setBold(true)->setSize(26);
        $activeSheet->getStyle('A8:I8')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Tables

        // Format numberic if empty default value is dash (-).
        $activeSheet->getStyle('D:I')->getNumberFormat()->setFormatCode('_-* #,##0.000_-;-* #,##0.000_-;_-* "-"??_-;_-@_-');

        // Set bold font of sub totals.
        $highestDataRow = $activeSheet->getHighestRow();
        $IndexSubTotals = (int)$highestDataRow;

        if ($IndexSubTotals > 10) {
            $activeSheet->getStyle("B{$IndexSubTotals}:I{$IndexSubTotals}")->getFont()->setBold(true);
        }
    }
}
