<?php

namespace App\Http\Controllers;

use App\Http\Requests\TrucksVans\ScheduleTodayRequest;
use App\Http\Requests\TrucksVans\StatusRequest;
use App\Interfaces\ITrucksVansRepository;
use App\Traits\HttpResponse;
use Illuminate\Http\Request;

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

    public function statusDetails(StatusRequest $request)
    {
        try {
            $request->validated($request->all());

            $searchVal = $request->input('vanMonitorNo');
            $action = $request->input('action');
            $customerCode = $request->user()->company()->value('customer_code');

            $details = $this->trucks->getTrucksVansStatusDetails($searchVal, $customerCode, $action);

            return $this->sendResponse($details, 'Trucks and vans status details');

        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }

    public function scheduleToday(ScheduleTodayRequest $request)
    {
        try {
            $customerCode = $request->user()->company()->value('customer_code');

            $schedule = $this->trucks->getScheduleToday($customerCode);

            return $this->sendResponse($schedule, 'Trucks and vans schedule today');
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }
}
