<?php

namespace App\Http\Controllers;

use App\Traits\HttpResponse;
use App\Interfaces\IWarehouseRepository;

class WarehouseController extends Controller
{
    use HttpResponse;

    private $warehouse;

    public function __construct(IWarehouseRepository $warehouse)
    {
        $this->warehouse = $warehouse;
    }

    public function list()
    {
        try {
            $WhList = $this->warehouse->warehouseList();

            return $this->sendResponse($WhList, 'List of warehouse');
        } catch (Exception $e) {
            return $this->sendError($e);
        }
    }
}
