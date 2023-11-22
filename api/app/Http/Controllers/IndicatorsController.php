<?php

namespace App\Http\Controllers;

use App\Interfaces\IIndicatorsRepository;
use App\Http\Requests\IndicatorsRequest;
use App\Traits\HttpResponse;
use Exception;
use Illuminate\Http\Request;
use Carbon\Carbon;

class IndicatorsController extends Controller
{
    use HttpResponse;

    private $indicator;

    public function __construct(IIndicatorsRepository $indicator)
    {
        $this->indicator = $indicator;
    }

    public function inoutBound(IndicatorsRequest $request)
    {
        try {
            $request->validated($request->all());

            $customerCode = $request->input('customer_code');
            $weight = $this->indicator->getInboundOutboundWt($customerCode);
            $transactions = $this->indicator->getInboundOutboundTxn($customerCode);

            return $this->sendResponse([
                'byWeight' => $weight,
                'byTransactions' => $transactions,
            ]);
        } catch (Exception $e) {
            return $this->sendError($e);
        }

    }

    public function activeSku(IndicatorsRequest $request)
    {
        try {
            $request->validated($request->all());

            $customerCode = $request->input('customer_code');
            $todayDate = Carbon::today()->format('Ymd');
            $yesterdayDate = Carbon::yesterday()->format('Ymd');

            $today = $this->indicator->getActiveSku($customerCode, $todayDate);
            $yesterday = $this->indicator->getActiveSku($customerCode, $yesterdayDate);

            return $this->sendResponse(['today' => $today, 'yesterday' => $yesterday]);
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }
}
