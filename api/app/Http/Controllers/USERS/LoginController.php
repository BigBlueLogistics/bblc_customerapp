<?php

namespace App\Http\Controllers\USERS;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use App\DbConnector\OracleQuery;
use App\Traits\HttpResponse;
use Illuminate\Support\Facades\Validator;

class LoginController extends Controller
{
    use HttpResponse;

    public function authenticate(Request $request)
    {
        try {
            $credentials = $request->only('email', 'password');

            $validator = Validator::make($credentials, [
                'email' => 'required|string|email',
                'password' => 'required|string|min:8'
            ]);

            // Determine if the data fails the validation rules.
            if ($validator->fails()) {
                return $this->sendError($validator->errors()->all(), 422);
            }

            // Retrieve the validated input
            $validated = $validator->validated();

            $hash_password = base64_encode(sha1(utf8_encode($validated['password']), true));

            $user = User::where([
                'EMAIL' => $validated['email'],
                'PWORD' => $hash_password
            ])->first();

            // TODO: generate token 
            if ($user) {
                if ($user['pword'] === $hash_password) {
                    return $this->sendResponse("Successfully login", $user);
                }
                return $this->sendError("Password mismatch", 422);
            }
            return $this->sendError("Invalid username/password", 422);
        } catch (\Exception $e) {
            return $this->sendError('Something went wrong: ' . $e->getMessage());
        }
    }

    public function testoracle()
    {
        $conn = OracleQuery::select('SELECT BBLWMS.SEQ_HST_trans_ID.nextval FROM DUAL');

        return $this->sendResponse($conn);
    }
}
