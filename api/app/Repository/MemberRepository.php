<?php

namespace App\Repository;

use App\Facades\SapRfcFacade;
use App\Interfaces\IMemberRepository;

class MemberRepository implements IMemberRepository
{
    public function getMemberInfo($customerCode)
    {
        $mandt = SapRfcFacade::getMandt();
        $customer = SapRfcFacade::functionModule('ZFM_BBP_RFC_READ_TABLE')
             ->param('QUERY_TABLE', 'KNA1')
             ->param('DELIMITER', ';')
             ->param('OPTIONS', [
                 ['TEXT' => "MANDT EQ {$mandt}"],
                 ['TEXT' => " AND KUNNR EQ '{$customerCode}'"],
             ])
             ->param('FIELDS', [
                 ['FIELDNAME' => 'NAME1'], // customer fullname
                 ['FIELDNAME' => 'STRAS'], // strict name
                 ['FIELDNAME' => 'ORT01'], // city
                 ['FIELDNAME' => 'LAND1'], // country
                 ['FIELDNAME' => 'PSTLZ'], // zip code
                 ['FIELDNAME' => 'TELF1'], // telephone
             ])
        ->getDataToArray();

        if (count($customer)) {
            return [
                'name' => $customer[0]['NAME1'],
                'address' => $customer[0]['STRAS'].', '.$customer[0]['ORT01'].', '.$customer[0]['LAND1'].', '.$customer[0]['PSTLZ'],
                'phone' => $customer[0]['TELF1'],
            ];
        }

        return [];
    }
}
