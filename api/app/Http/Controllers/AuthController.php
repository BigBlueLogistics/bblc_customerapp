<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Requests\ResetPassRequest;
use App\Models\User;
use App\Traits\HttpResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    use HttpResponse;

    public function login(LoginUserRequest $request)
    {
        $request->validated($request->all());

        $user = User::where('email', $request->email)->first();
        if (! $user->active || $user->active === 'false') {
            return $this->sendError(__('auth.disabled'), Response::HTTP_UNAUTHORIZED);
        }
        if (! $user->email_verified_at) {
            return $this->sendError(__('auth.not-verified'), Response::HTTP_UNAUTHORIZED);
        }

        $authenticate = Auth::attemptWhen([
            'email' => $request->email,
            'password' => $request->password,
        ]);

        if (! $authenticate) {
            return $this->sendError(__('auth.failed'), Response::HTTP_UNAUTHORIZED);
        }

        // Regenerate user's session to prevent session fixation.
        $request->session()->regenerate();

        return $this->sendResponse(
            [
                'user' => $user,
            ],
            'Login successful'
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
                'fname' => $request->fname,
                'lname' => $request->lname,
                'password' => Hash::make($request->password),
                'email' => $request->email,
                'customer_code' => $request->customer_code,
                'phone_no' => $request->phone_no,
            ]);

            if ($user) {
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
            return $this->sendError('Something went wrong '.$e->getMessage());
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
            return $this->sendError('Something went wrong '.$e->getMessage());
        }
    }

    public function logout(Request $request)
    {
        Auth('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->sendResponse('', __('auth.logout'));
    }

    public function isAuthenticated()
    {
        return $this->sendResponse(['authenticated' => true, 'user' => Auth::user()]);
    }
}
