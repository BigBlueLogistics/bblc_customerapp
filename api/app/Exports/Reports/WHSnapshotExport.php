<?php

namespace App\Exports\Reports;

use App\Interfaces\IMemberRepository;
use App\Interfaces\IReportsRepository;
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

class WHSnapshotExport implements FromView, ShouldAutoSize, WithEvents, WithDrawings
{
    use RegistersEventListeners;

    private $reportsExport;

    private $member;

    private $customerCode;

    private $warehouseNo;

    private $groupBy;

    public function __construct(IReportsRepository $reports, IMemberRepository $member)
    {
        $this->reportsExport = $reports;
        $this->member = $member;
    }

    public function setFilterBy($customerCode, $warehouseNo, $groupBy)
    {
        $this->customerCode = $customerCode;
        $this->warehouseNo = $warehouseNo;
        $this->groupBy = $groupBy;
    }

    public function view(): View
    {
        $result = $this->reportsExport->getWhSnapshot($this->customerCode, $this->warehouseNo, $this->groupBy);
        $customerInfo = $this->member->getMemberInfo($this->customerCode);

        $stocks = count($result) ? $result : [];

        $dateTimeNow = Carbon::now();

        $caption = "Warehouse snapshot - by {$this->groupBy}";

        return view('exports.reports.wh_snapshot', [
            'caption' => strtoupper($caption),
            'groupBy' => $this->groupBy,
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
        $activeSheet->getStyle('G5:G8')->getFont()->setBold(true);

        // Label: Warehouse stocks.
        $activeSheet->mergeCells('A8:K8')->getStyle('A8:K8')->getFont()->setBold(true)->setSize(26);
        $activeSheet->getStyle('A8:K8')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Tables

        // Format numberic if empty default value is dash (-).
        $columnNumberFormat = 'D:K';
        $concernable = $event->getConcernable();
        if ($concernable->groupBy === 'batch' || $concernable->groupBy === 'expiry') {
            $columnNumberFormat = 'E:L';
        }
        $activeSheet->getStyle($columnNumberFormat)->getNumberFormat()->setFormatCode('_-* #,##0.000_-;-* #,##0.000_-;_-* "-"??_-;_-@_-');

        // Set bold font of sub totals.
        $highestDataRow = $activeSheet->getHighestRow();
        $IndexSubTotals = (int) $highestDataRow;

        if ($IndexSubTotals > 10) {
            $activeSheet->getStyle("B{$IndexSubTotals}:L{$IndexSubTotals}")->getFont()->setBold(true);
        }
    }
}
