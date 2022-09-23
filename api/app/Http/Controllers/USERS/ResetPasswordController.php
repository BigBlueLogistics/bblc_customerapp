<?php

namespace App\Http\Controllers\USERS;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Password;

use App\Models\User;
use App\Mail\PasswordResetMail;
use App\Traits\HttpResponse;

class ResetPasswordController extends Controller
{

    use HttpResponse;

    public function _reset(Request $request)
    {
        try {
            $validator = Validator::make($request->only('email'), ['email' => 'required|email']);

            if ($validator->fails()) {
                return $this->sendError($validator->errors()->all(), 422);
            }

            $validated = $validator->validated();

            // Check the email if exist
            $input = User::where(['EMAIL' => $validated['email']])->first();
            if ($input) {

                // Generate random password
                $random_password = Str::random(8);
                $hash_password = base64_encode(sha1(utf8_encode($random_password), true));

                // Update the field of PWORD with $hash_password from generated random string
                $update = User::where(['EMAIL' => $input['email']])
                    ->update(['PWORD' => $hash_password]);

                if ($update) {
                    // Send an email from generated random string to use for default password.
                    Mail::to($input['email'])->queue(new PasswordResetMail($random_password));
                    return $this->sendResponse("Password reset email sent");
                }
            }
            return $this->sendError("Email not exists", 404);
        } catch (\Exception $e) {
            return $this->sendError('Something went wrong: ' . $e->getMessage());
        }
    }


    public function forgot(Request $request)
    {
        try {
            $validator = Validator::make($request->only('email'), ['email' => 'required|email']);

            $validated = $validator->validated();

            $status = Password::sendResetLink($validated);

            if ($status === Password::RESET_LINK_SENT) {
                return $this->sendResponse("Password reset email sent");
            }
            if ($status === Password::INVALID_USER) {
                return $this->sendError("Email not exists", 404);
            }

            return $this->sendError('Invalid json format of sending an email');
        } catch (\Exception $e) {
            return $this->sendError('Something went wrong ' . $e->getMessage());
        }
    }


    public function reset(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'token' => 'required|string',
                'password' => 'required|string'
            ]);

            if ($validator->fails()) {
                return $this->sendError($validator->errors()->all(), 422);
            }

            $validated = $validator->validated();
            $status = Password::reset($validated, function ($user, $password) {

                $hash_password = base64_encode(sha1(utf8_encode($password), true));

                // Update the field of PWORD with $hash_password
                User::where(['email' => $user['email']])
                    ->update(['pword' => $hash_password]);
            });

            if ($status === Password::PASSWORD_RESET) {
                return $this->sendResponse("Password reset successful");
            }
            if ($status === Password::INVALID_USER) {
                return $this->sendError("Email not exists", 404);
            }
            if ($status === Password::INVALID_TOKEN) {
                return $this->sendError("Invalid token", 400);
            }

            return $this->sendError("Failed to reset password" . $status);
        } catch (\Exception $e) {
            return $this->sendError('Something went wrong ' . $e->getMessage());
        }
    }
}
