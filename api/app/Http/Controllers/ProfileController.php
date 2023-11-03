<?php

namespace App\Http\Controllers;

use App\Http\Requests\Profile\ChangePassRequest;
use App\Http\Requests\Profile\MainRequest;
use App\Models\User;
use App\Traits\HttpResponse;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    use HttpResponse;

    public function edit()
    {
        try {
            $email = Auth::user()->email;

            $profile = User::where('email', $email)->first(['phone_num', 'van_status']);

            if($profile){
                $vanStatus = $profile->van_status == "x" ? "true" : "false";
                return $this->sendResponse([
                    'van_status' => $vanStatus,
                    'phone_num' => $profile->phone_num
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

            $id = Auth::user()->id;

            $profile = User::find($id);
            $profile->phone_num = $request->phone_num;
            $profile->van_status = strval($request->van_status) == "true" ? "x" : null;
            $profile->save();

            $data = $profile->only(['van_status','phone_num']);
            $vanStatus = $data['van_status'] == "x" ? "true" : "false";
            return $this->sendResponse([
                'van_status' => $vanStatus,
                'phone_num' => $data['phone_num']
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
