<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginUserRequest;
use App\Http\Requests\RegisterUserRequest;
use App\Http\Requests\ResetPassRequest;
use App\Jobs\JobNotificationToAdmin;
use App\Models\CompanyRepresent;
use App\Models\Role;
use App\Models\User;
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
        $relations = [
            'companies' => collect($user->companies)->pluck('customer_code'),
            'role_name' => Role::where('id', $user->role_id)->first(['name'])->name ?? null,
        ];

        return $this->sendResponse(
            [
                'user' => array_merge($user->toArray(), $relations),
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

            $email = Str::lower($request->email);
            $user = User::create([
                'fname' => Str::lower($request->fname),
                'lname' => Str::lower($request->lname),
                'password' => Hash::make($request->password),
                'email' => $email,
                'phone_num' => Str::lower($request->phone_num),
            ]);

            if ($user) {
                CompanyRepresent::create([
                    'user_id' => $user->id,
                    'company' => $request->company,
                ]);

                // Send an email notification to Admin about new registered user
                $adminEmails = User::where('role_id', '=', 1)->select('email')->get();
                if (count($adminEmails)) {
                    $adminEmails = collect($adminEmails)->pluck('email');

                    $adminEmails->all();
                }
                $newRegisteredEmail = $email;

                $uiUrl = env('APP_URL');
                $url = "{$uiUrl}/members";

                JobNotificationToAdmin::dispatch($adminEmails, $newRegisteredEmail, $url);

                return $this->sendResponse('', __('auth.register'));
            }

            return $this->sendError(__('auth.register-failed'));
        } catch (\Exception $e) {
            return $this->sendError($e);
        }
    }

    public function resetLink(Request $request)
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

    public function reset(ResetPassRequest $request)
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

    public function logout()
    {
        Auth()->user()->currentAccessToken()->delete();

        return $this->sendResponse(null, __('auth.logout'));
    }

    public function isAuthenticated(Request $request)
    {
        $relations = [
            'companies' => collect($request->user()->companies)->pluck('customer_code'),
            'role_name' => Role::where('id', $request->user()->role_id)->first(['name'])->name ?? null,
        ];
        $currentToken = $request->bearerToken();

        return $this->sendResponse([
            'authenticated' => Auth::check(),
            'user' => array_merge(Auth::user()->toArray(), $relations),
            'token' => $currentToken,
        ], __('auth.re-authenticate'));
    }
}
