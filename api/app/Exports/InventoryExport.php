<?php

namespace App\Exports;

use App\Interfaces\IInventoryRepository;
use App\Interfaces\IMemberRepository;
use Carbon\Carbon;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\RegistersEventListeners;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class InventoryExport implements FromView, ShouldAutoSize, WithEvents, WithDrawings
{
    use RegistersEventListeners;

    private $inventoryExport;

    private $member;

    private $customerCode;

    private $warehouseNo;

    public function __construct(IInventoryRepository $inventory, IMemberRepository $member)
    {
        $this->inventoryExport = $inventory;
        $this->member = $member;
    }

    public function setFilterBy($customerCode, $warehouseNo)
    {
        $this->customerCode = $customerCode;
        $this->warehouseNo = $warehouseNo;
    }

    public function view(): View
    {
        $result = $this->inventoryExport->getStocksInventory($this->customerCode, $this->warehouseNo, 'material');
        $customerInfo = $this->member->getMemberInfo($this->customerCode);

        $stocks = count($result) ? $result : [];

        $dateTimeNow = Carbon::now();

        return view('exports.inventory', [
            'stocks' => $stocks,
            'warehouseNo' => $this->warehouseNo,
            'dateNow' => $dateTimeNow->format('m/d/Y'),
            'timeNow' => $dateTimeNow->format('h:i:s A'),
            'customerName' => $customerInfo['name'],
            'address' => $customerInfo['address'],
            'phone' => $customerInfo['phone'],
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
        $activeSheet->getStyle('J5:J8')->getFont()->setBold(true);

        // Label: Warehouse stocks.
        $activeSheet->mergeCells('A8:K8')->getStyle('A8:K8')->getFont()->setBold(true)->setSize(26);
        $activeSheet->getStyle('A8:K8')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Tables

        // Format numberic if empty default value is dash (-).
        // Allocated - Total
        $activeSheet->getStyle('E:L')->getNumberFormat()->setFormatCode('_-* #,##0.000_-;-* #,##0.000_-;_-* "-"??_-;_-@_-');

        // Set bold font of sub totals.
        $highestDataRow = $activeSheet->getHighestRow();
        $IndexSubTotals = (int) $highestDataRow;

        if ($IndexSubTotals > 10) {
            // Allocated - Total
            $activeSheet->getStyle("B{$IndexSubTotals}:L{$IndexSubTotals}")->getFont()->setBold(true);
        }
    }
}
