<?php

namespace App\Repository;

use App\Facades\SapRfcFacade;
use App\Interfaces\IMemberRepository;
use DB;
use Carbon\Carbon;

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

    public function createInventoryReport($data)
    {
        $email = $data['email']; 
        $customerCode = $data['customer_code']; 
        $fname = $data['fname']; 
        $lname = $data['lname']; 
        $phone = strtoupper($data['phone_num']); 

        // check first if exists
        $recipient = DB::connection('wms')->table('PRTR')->select('*')
                     ->where('KUNNR', $customerCode)
                     ->whereRaw('UPPER(email) = ?' ,[$email])
                     ->first();

        if($recipient){
            return 'Email is already existing as recipient of selected customer';
        }
        else{
            $currentDatetime = Carbon::now();
            $insert = DB::connection('wms')->table('PRTR')
                ->insert([
                    'KUNNR' => $customerCode,
                    'FNAME' => $fname,
                    'LNAME' => $lname,
                    'UNAME' => "{$fname} {$lname}",
                    'EMAIL' => $email,
                    'PHONE' => $phone,
                    'ERDAT' => $currentDatetime,
                ]);

            if($insert){
                return 'Successfully updated inventory email recipient(s)';
            }
            return 'Failed updating inventory email recipient(s)';
        }

    }
}
