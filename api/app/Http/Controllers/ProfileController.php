<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profile\ChangePassRequest;
use App\Http\Requests\Profile\MainRequest;
use App\Models\User;
use App\Interfaces\IMemberRepository;
use App\Traits\HttpResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    use HttpResponse;

    private $members;

    public function __construct(IMemberRepository $members) {
        $this->members = $members;
    }

    public function edit()
    {
        try {
            $email = Auth::user()->email;

            $profile = User::where('email', $email)->first(['phone_num', 'van_status', 'invnt_report']);

            if($profile){
                $vanStatus = $profile->van_status == 'x';
                $invntReport = $profile->invnt_report == 'x';
                return $this->sendResponse([
                    'van_status' => $vanStatus,
                    'phone_num' => $profile->phone_num,
                    'invnt_report' => $invntReport
                ]);
            }
        } catch (Throwable $th) {
            return $this->sendError($th);
        }
    }

    public function update(MainRequest $request)
    {
        try {
            $request->validated($request->all());

            $authUser = Auth::user();

            $profile = User::find($authUser->id);
            $profile->phone_num = $request->phone_num;
            $profile->van_status = $request->van_status ? 'x' : null;
            $profile->invnt_report = $request->invnt_report ? 'x' : null;
            $isSuccess = $profile->save();

            if($isSuccess){
                // insert inventory report
                $invntReportData = $request->only('phone_num','invnt_report');
                $invntNewReportData = array_merge($invntReportData, [
                    'fname' => $authUser->fname,
                    'lname' => $authUser->lname,
                    'email' => $authUser->email,
                    'customer_code' =>  $authUser->company->customer_code
                ]);
                
                $invntReportMsg = $this->members->createInventoryReport($invntNewReportData);
            }

            $data = $profile->only(['phone_num','van_status','invnt_report']);
            $vanStatus = $data['van_status'] == 'x' ;
            $invntReport = $data['invnt_report'] == 'x';

            return $this->sendResponse([
                'phone_num' => $data['phone_num'],
                'van_status' => $vanStatus,
                'invnt_report' => $invntReport,
                'invnt_report_msg' => $invntReportMsg
                ], 
                'Succesfully update profile information'
            );
        } catch (Throwable $th) {
            return $this->sendError($th);
        }
    }

    public function changePass(ChangePassRequest $request)
    {
        try {
            $request->validated($request->all());

            $email = Auth::user()->email;

            $profile = User::where('email', $email)->first();

            if (! $profile || ! Hash::check($request->current_password, $profile->password)) {
                return $this->sendError('Current password not match', Response::HTTP_UNAUTHORIZED);
            }
            if ($request->new_password !== $request->confirm_password) {
                return $this->sendError('New and confirm new password not match.', Response::HTTP_UNAUTHORIZED);
            }

            // Update user password
            $profile->password = Hash::make($request->confirm_password);
            $profile->save();

            return $this->sendResponse(null, 'New password has been set.');
        } catch (Throwable $th) {
            return $this->sendError($th);
        }
    }
}
