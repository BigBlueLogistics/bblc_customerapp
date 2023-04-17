<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Interfaces\IIndicatorsRepository;
use App\Traits\HttpResponse;
use Exception;

class IndicatorsController extends Controller
{
    use HttpResponse;

    private $indicator;

    public function __construct(IIndicatorsRepository $indicator)
    {
        $this->indicator = $indicator;
    }

    public function inoutBound(Request $request)
    {
        try {
            $customerCode = $request->input('customer_code');
            $res = $this->indicator->getInboundOutbound($customerCode);
    
            return $this->sendResponse($res);
        } catch (Exception $e) {
            return $this->sendError($e);
        }

    }

    public function activeSku(Request $request)
    {
        try {
            $customerCode = $request->input('customer_code');
            $res = $this->indicator->getActiveSku($customerCode);

            return $this->sendResponse($res);
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }
}
