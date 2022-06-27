<?php

namespace App\Http\Controllers\USERS;

use App\Http\Controllers\API\BaseController;
use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Facades\Validator;

class RegisterController extends BaseController
{

    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'fname' => 'required|string',
                'lname' => 'required|string',
                'pword' => 'required|string|min:8',
                'email' => 'required|string|email',
                'company' => 'required|string',
                'phone' => 'string'
            ]);

            if ($validator->fails()) {
                return $this->sendError($validator->errors()->all(), 422);
            }

            $validated = $validator->validated();

            $hash_password = base64_encode(sha1(utf8_encode($validated['pword']), true));

            // Insert data
            $user = User::create([
                'uname' => strtoupper(substr($validated['fname'], 0, 1) . $validated['lname']),
                'fname' => strtoupper($validated['fname']),
                'lname' => strtoupper($validated['lname']),
                'pword' => $hash_password,
                'email' => $validated['email'],
                'client' => strtoupper($validated['company']),
                'phone' => $validated['lname']
            ]);

            if ($user) {
                return $this->sendResponse("Successfully registered.");
            }
            return $this->sendError("Opss, Please try again later can't process the registration.", 422);
        } catch (\Exception $e) {
            return $this->sendError('Something went wrong: ' . $e->getMessage());
        }
    }
}
