<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'fname' => ['required', 'string'],
            'lname' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8'],
            'email' => ['required', 'string', 'email'],
            'phone_no' => ['string'],
            'company' => ['required', 'string']
        ];
    }
}
