<?php

namespace App\Interfaces;

interface IOrderRepository
{
    public function materialAndDescription($customerCode, $warehouseNo);

    public function productUnits($materialCode);

    public function expiryBatch($materialCode, $warehouseNo);

    public function readText($docNo);

    public function adhocDetails($customerCode, $docNo);

    public function createAdhocRequest($data, $authUser);

    public function uploadFile($request, $transId);

    public function retrieveFile($transId);

    public function deleteFile($fileNames, $transId);
}
