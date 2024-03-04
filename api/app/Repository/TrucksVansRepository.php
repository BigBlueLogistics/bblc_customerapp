<?php

namespace App\Repository;

use App\Interfaces\ITrucksVansRepository;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class TrucksVansRepository implements ITrucksVansRepository
{
    public function getTrucksVansStatus($customerCode)
    {
        $res = DB::connection('wms')->table('VANS')
            ->selectRaw('vnmbr AS vanNo, vmrno, 
             vtype AS type, vsize AS size, UPPER(pstat) AS pluggedStatus,
             adatu AS arrivalDate, odatu AS outDate, werks AS location,
             whdat AS whDate, cstat AS currentStatus, astat AS arrivalStatus,
             wschd AS whSchedule')
            ->whereNull('odatu')
            ->where('kunnr', '=', $customerCode)
            ->orderBy('werks', 'desc')
            ->get();

        return $res;
    }

    public function getTrucksVansStatusDetails($searchVal, $customerCode, $action)
    {
        $actionIsView = boolval($action === 'view');

        $res = DB::connection('wms')->table('VANS')
            ->selectRaw('vnmbr AS vanNo, vmrno, 
                vtype AS type, vsize AS size, UPPER(pstat) AS pluggedStatus,
                adatu AS arrivalDate, CONVERT(VARCHAR, azeit, 8) AS arrivalTime, 
                adnum AS arrivalDeliveryNo, astat AS arrivalStatus, aseal AS arrivalSealNo,
                frdwr AS forwarder, odatu AS outDate, ozeit AS outTime, oseal AS outSealNo, 
                odnum AS outDeliveryNo, ostat AS outStatus, wschd AS whSchedule,
                whdat AS whProcessStartDate, whtim AS whProcessStartTime, ctime AS whProcessEnd')
            ->when($actionIsView, function (Builder $query) use ($searchVal, $customerCode) {
                return $query->where('vmrno', '=', $searchVal)
                    ->where('kunnr', '=', $customerCode);
            }, function (Builder $query) use ($searchVal, $customerCode) {
                return $query->where('kunnr', '=', $customerCode)
                    ->where(function (Builder $query) use ($searchVal) {
                        return $query->where('vnmbr', 'like', '%'.$searchVal.'%')
                            ->Orwhere('vmrno', 'like', '%'.$searchVal.'%');
                    });
            })
            ->orderBy('adatu', 'desc')
            ->limit(1)
            ->first();

        if ($res) {
            // When action is VIEW the 2nd argument callback will invoke
            // else the last callback
            $plugin = DB::connection('wms')->table('PLUG')
                ->selectRaw('psdat AS startDate, pstim AS startTime, pedat AS endDate, petim AS endTime,
                pitot AS totalPlugHrs, [Index] AS id')
                ->when($actionIsView, function (Builder $query) use ($searchVal, $customerCode) {
                    return $query->where('vmrno', '=', $searchVal)
                        ->where('kunnr', '=', $customerCode);
                }, function (Builder $query) use ($searchVal, $customerCode) {
                    return $query->where('kunnr', '=', $customerCode)
                        ->where(function (Builder $query) use ($searchVal) {
                            return $query->where('vnmbr', 'like', '%'.$searchVal.'%')
                                ->Orwhere('vmrno', 'like', '%'.$searchVal.'%');
                        });
                })
                ->orderBy('psdat', 'desc')
                ->limit(1)
                ->get();

            $res->plugin = $plugin;
        }

        return $res;
    }

    public function getScheduleToday($customerCode)
    {
        $res = DB::connection('wms')->table('iclt')
            ->join('hclt', 'iclt.kunnr', '=', 'hclt.kunnr')
            ->selectRaw('iclt.vhnum AS vehicleNum, iclt.ardat AS arrivalDate, 
                    CONVERT(VARCHAR, iclt.artim, 8) AS arrivalTime,
                    hclt.vhtyp as vehicleType')
            ->where('iclt.kunnr', '=', $customerCode)
            ->whereNull('iclt.pudat')
            ->orderBy('iclt.ardat', 'desc')
            ->get();

        return $res;
    }

    public function createNotices($request)
    {
        $res = DB::connection('wms')->table('PRTR')
                ->insert([
                    'FNAME' => $request->input('fname') ? strtoupper($request->input('fname')) : null,
                    'LNAME' => $request->input('lname') ? strtoupper($request->input('lname')) : null,
                    'EMAIL' => $request->input('emailAdd') ? strtoupper($request->input('emailAdd')) : null,
                    'PHONE' => strtoupper($request->input('phoneNum')),
                    'KUNNR' => strtoupper($request->input('customerCode')),
                    'VANST' => 'X',
                    'NONIN' => 'X'
                ]);
        return $res;
    }
    
    public function deleteNotices($customerCode, $phoneNum)
    {
        $res = DB::connection('wms')->table('PRTR')
                ->where('KUNNR', '=', $customerCode)
                ->where('PHONE', '=', $phoneNum)
                ->delete();
               
        return $res;
    }
}
