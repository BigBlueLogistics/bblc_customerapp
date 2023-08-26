<?php

namespace App\Repository;

use Illuminate\Support\Facades\DB;
use App\Interfaces\ITrucksVansRepository;


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
             ->where('kunnr','=', $customerCode)
             ->orderBy('adatu','desc')
             ->get();

        return $res;
    }

    public function getTrucksVansStatusDetails($vanMonitorNo, $customerCode)
    {
        $res = DB::connection('wms')->table('VANS')
            ->selectRaw('vnmbr AS vanNo, vmrno, 
                vtype AS type, vsize AS size, UPPER(pstat) AS pluggedStatus,
                adatu AS arrivalDate, CONVERT(VARCHAR, azeit, 8) AS arrivalTime, 
                adnum AS arrivalDeliveryNo, astat AS arrivalStatus, aseal AS arrivalSealNo,
                frdwr AS forwarder, odatu AS outDate, ozeit AS outTime, oseal AS outSealNo, 
                odnum AS outDeliveryNo, ostat AS outStatus, wschd AS whSchedule,
                whdat AS whProcessStartDate, whtim AS whProcessStartTime, ctime AS whProcessEnd')
            ->where('vmrno','=', $vanMonitorNo)
            ->where('kunnr','=', $customerCode)
            ->orderBy('adatu', 'desc')
            ->limit(1)
            ->first();

        $plugin = DB::connection('wms')->table('PLUG')
            ->selectRaw('psdat AS startDate, pstim AS startTime, pedat AS endDate, petim AS endTime,
                pitot AS totalPlugHrs, [Index] AS id')
            ->where('vmrno', '=', $vanMonitorNo)
            ->where('kunnr','=', $customerCode)
            ->orderBy('pedat','desc')
            ->get();

        if($res){
            $res->plugin = $plugin;
        }

        return $res;
    }
}