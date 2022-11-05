<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Requests\ResetPassRequest;
use App\Models\User;
use App\Models\CompanyRepresent;
use App\Traits\HttpResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    use HttpResponse;

    public function login(LoginUserRequest $request)
    {
        $request->validated($request->all());

        $user = User::where('email', $request->email)->first();
        if ($user && (! $user->active || $user->active === 'false')) {
            return $this->sendError(__('auth.disabled'), Response::HTTP_UNAUTHORIZED);
        }
        if ($user && ! $user->email_verified_at) {
            return $this->sendError(__('auth.not-verified'), Response::HTTP_UNAUTHORIZED);
        }
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return $this->sendError(__('auth.failed'), Response::HTTP_UNAUTHORIZED);
        }

        $token = $user->createToken($user->email)->plainTextToken;
        $customerCode = [
           'customer_code' => $user->company()->value('customer_code')
        ];

        return $this->sendResponse(
            [
                'user'  =>  array_merge($user->toArray(), $customerCode),
                'token' => $token,
            ],
            __('auth.success')
        );
    }

    public function register(RegisterUserRequest $request)
    {
        try {
            $request->validated($request->all());
            $isExist = User::where('email', $request->email)->first();

            if ($isExist) {
                return $this->sendError(__('auth.register-exists'), Response::HTTP_CONFLICT);
            }

            $user = User::create([
                'fname' => Str::lower($request->fname),
                'lname' => Str::lower($request->lname),
                'password' => Hash::make($request->password),
                'email' => Str::lower($request->email),
                'phone_no' => Str::lower($request->phone_no),
            ]);

            if ($user) {
                CompanyRepresent::create([
                    'user_id' => $user->id,
                    'company' => $request->company
                ]);
                return $this->sendResponse('', __('auth.register'));
            }

            return $this->sendError(__('auth.register-failed'));
        } catch (\Exception $e) {
            return $this->sendError($e);
        }
    }

    public function reset(Request $request)
    {
        try {
            $validator = Validator::make($request->only('email'), ['email' => 'required|email']);

            $validated = $validator->validated();

            $status = Password::sendResetLink($validated);

            if ($status === Password::RESET_LINK_SENT) {
                return $this->sendResponse('', __('passwords.sent'));
            }
            if ($status === Password::INVALID_USER) {
                return $this->sendError(__('passwords.user'), Response::HTTP_NOT_FOUND);
            }
            if ($status === Password::RESET_THROTTLED) {
                return $this->sendError(__('passwords.throttled'), Response::HTTP_TOO_MANY_REQUESTS);
            }

            return $this->sendError(__('passwords.invalid-json'));
        } catch (\Exception $e) {
            return $this->sendError($e);
        }
    }

    public function change(ResetPassRequest $request)
    {
        try {
            $request->validated($request->only('email', 'password', 'token'));

            $status = Password::reset($request->only('email', 'password', 'token'), function ($user, $password) {
                $hash_password = Hash::make($password);

                // Update the field with new hashed password
                User::where(['email' => $user->email])
                    ->update(['password' => $hash_password]);
            });

            if ($status === Password::PASSWORD_RESET) {
                return $this->sendResponse('', __('passwords.reset'));
            }
            if ($status === Password::INVALID_USER) {
                return $this->sendError(__('passwords.user'), Response::HTTP_NOT_FOUND);
            }
            if ($status === Password::INVALID_TOKEN) {
                return $this->sendError(__('passwords.token'), Response::HTTP_BAD_REQUEST);
            }

            return $this->sendError(__('passwords.reset-failed'));
        } catch (\Exception $e) {
            return $this->sendError($e);
        }
    }

    public function logout(Request $request)
    {
        Auth()->user()->currentAccessToken()->delete();

        return $this->sendResponse('', __('auth.logout'));
    }

    public function isAuthenticated(Request $request)
    {
        $customerCode = [
            'customer_code' => $request->user()->company()->value('customer_code')
         ];
        $currentToken = $request->bearerToken();

        return $this->sendResponse([
                'authenticated' => Auth::check(),
                'user' => array_merge(Auth::user()->toArray(), $customerCode),
                'token' => $currentToken
            ], __('auth.re-authenticate'));
    }
}
