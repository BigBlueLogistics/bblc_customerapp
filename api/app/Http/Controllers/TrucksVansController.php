<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\TrucksVansRequest;
use App\Traits\HttpResponse;
use App\Interfaces\ITrucksVansRepository;

class TrucksVansController extends Controller
{
    use HttpResponse;

    private $trucks;

    public function __construct(ITrucksVansRepository $trucks)
    {
        $this->trucks = $trucks;
    }

    public function status(Request $request)
    {
        try {
            $customerCode = $request->user()->company()->value('customer_code');


            $status = $this->trucks->getTrucksVansStatus($customerCode);

            return $this->sendResponse($status, 'Trucks and vans status');
        } catch (Exception $e) {
            return $this->sendError($e);
        }


    }

    public function statusDetails(TrucksVansRequest $request)
    {
        try {
            $request->validated($request->all());

            $vanMonitorNo = $request->input('vanMonitorNo');

            $details = $this->trucks->getTrucksVansStatusDetails($vanMonitorNo);

            return $this->sendResponse($details, 'Trucks and vans status details');
            
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }
}
