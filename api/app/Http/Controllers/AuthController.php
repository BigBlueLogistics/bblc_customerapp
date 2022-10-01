<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Password;

use App\Traits\HttpResponse;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\ResetPassRequest;
use App\Models\User;

class AuthController extends Controller
{
    use HttpResponse;

    public function login(LoginUserRequest $request)
    {
        $request->validated($request->all());

        $authenticate = Auth::attempt([
            'email' => $request->email,
            'password' => $request->password,
        ]);

        if (!$authenticate) {
            return $this->sendResponse('', 'Credentials not match', 401);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user->active || $user->active === 'false') {
            return $this->sendResponse('', 'Account has been disable', 401);
        }

        if (!$user->email_verified_at) {
            return $this->sendResponse('', 'Account is not yet verified. Please check your email we\'ve sent for verification.', 401);
        }

        $token = $user->createToken($user->email);

        return $this->sendResponse([
            'user' => $user,
            'token' => $token->plainTextToken
        ], 'Login successful');
    }


    public function register(RegisterUserRequest $request)
    {
        try {

            $request->validated($request->all());

            $user = User::create([
                'fname' => $request->fname,
                'lname' => $request->lname,
                'password' => Hash::make($request->password),
                'email' => $request->email,
                'customer_code' => $request->customer_code,
                'phone_no' => $request->phone_no
            ]);

            // Generate user token
            // $token = $user->createToken($request->email);

            if ($user) {
                return $this->sendResponse("", "Account has been succesully registered");
            }
            return $this->sendError("Account failed to register");
        } catch (\Exception $e) {
            return $this->sendError($e);
        }
    }


    public function forgot(Request $request)
    {
        try {
            $validator = Validator::make($request->only('email'), ['email' => 'required|email']);

            $validated = $validator->validated();

            $status = Password::sendResetLink($validated);

            if ($status === Password::RESET_LINK_SENT) {
                return $this->sendResponse('Password reset email sent');
            }
            if ($status === Password::INVALID_USER) {
                return $this->sendError('Email not exists', 404);
            }

            return $this->sendError('Invalid json format of sending an email');
        } catch (\Exception $e) {
            return $this->sendError('Something went wrong ' . $e->getMessage());
        }
    }


    public function reset(ResetPassRequest $request)
    {
        try {
            $request->validated($request->all());

            $status = Password::reset($request->all(), function ($user, $password) {

                $hash_password = Hash::make($password);

                // Update the field with new hashed password
                User::where(['email' => $user->email])
                    ->update(['password' => $hash_password]);
            });

            if ($status === Password::PASSWORD_RESET) {
                return $this->sendResponse('', 'Password reset successful');
            }
            if ($status === Password::INVALID_USER) {
                return $this->sendError('Email not exists', 404);
            }
            if ($status === Password::INVALID_TOKEN) {
                return $this->sendError('Invalid token', 400);
            }

            return $this->sendError('Failed to reset password' . $status);
        } catch (\Exception $e) {
            return $this->sendError('Something went wrong ' . $e->getMessage());
        }
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return $this->sendResponse('', 'Successfully logout');
    }
}
