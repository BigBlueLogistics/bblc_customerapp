<?php

namespace App\Exports;

use App\Interfaces\IMemberRepository;
use App\Interfaces\IMovementRepository;
use Carbon\Carbon;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\RegistersEventListeners;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithDrawings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Worksheet\Drawing;

class MovementExport implements FromView, ShouldAutoSize, WithEvents, WithDrawings, WithColumnWidths
{
    use RegistersEventListeners;

    private $movementExport;

    private $member;

    private $customerCode;

    private $warehouseNo;

    private $materialCode;

    private $movementType;

    private $coverageDate;

    public function __construct(IMovementRepository $movement, IMemberRepository $member)
    {
        $this->movementExport = $movement;
        $this->member = $member;
    }

    public function setFilterBy($customerCode, $warehouseNo, $materialCode, $movementType, $coverageDate)
    {
        $this->customerCode = $customerCode;
        $this->warehouseNo = $warehouseNo;
        $this->materialCode = $materialCode;
        $this->movementType = $movementType;
        $this->coverageDate = $coverageDate;
    }

    public function view(): View
    {
        [$fromDate, $toDate] = $this->coverageDate;
        $formatFromDate = Carbon::parse($fromDate)->format('Ymd');
        $formatToDate = Carbon::parse($toDate)->format('Ymd');

        if ($this->movementType === 'outbound') {
            $result = $this->movementExport->outboundMov($this->materialCode, $formatFromDate, $formatToDate, $this->warehouseNo, $this->customerCode, 'excel');
        } elseif ($this->movementType === 'inbound') {
            $result = $this->movementExport->inboundMov($this->materialCode, $formatFromDate, $formatToDate, $this->warehouseNo, $this->customerCode);
        } else {
            $result = $this->movementExport->mergeInOutbound($this->materialCode, $formatFromDate, $formatToDate, $this->warehouseNo, $this->customerCode, 'excel');
        }

        $customerInfo = $this->member->getMemberInfo($this->customerCode);

        $movementsData = count($result) ? $result : [];

        $dateTimeNow = Carbon::now();

        return view('exports.movement', [
            'movementsData' => $movementsData,
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

        $highestDataRow = $activeSheet->getHighestRow();

        // Headings label
        $activeSheet->getStyle('A5:A8')->getFont()->setBold(true);
        $activeSheet->getStyle('J5:J8')->getFont()->setBold(true);

        // Label: Warehouse stocks.
        $activeSheet->mergeCells('A8:N8')->getStyle('A8:N8')->getFont()->setBold(true)->setSize(26);
        $activeSheet->getStyle('A8:N8')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Tables

        if ($highestDataRow > 10) {
            // Document no
            $activeSheet->getStyle("D10:D{$highestDataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
            // Reference
            $activeSheet->getStyle("L10:L{$highestDataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
            // Batch
            $activeSheet->getStyle("G10:G{$highestDataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        }

        // Format numberic if empty default value is dash (-).
        // Quantity
        $activeSheet->getStyle('I')->getNumberFormat()->setFormatCode('_-* #,##0.000_-;-* #,##0.000_-;_-* "-"??_-;_-@_-');
        // Weight
        $activeSheet->getStyle('K')->getNumberFormat()->setFormatCode('_-* #,##0.000_-;-* #,##0.000_-;_-* "-"??_-;_-@_-');
    }

    public function columnWidths(): array
    {
        return [
            'C' => 12,  // Material
        ];
    }
}
