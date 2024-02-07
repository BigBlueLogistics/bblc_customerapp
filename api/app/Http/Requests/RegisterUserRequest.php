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
            'phone_num' => ['required', 'numeric', 'min_digits:11', 'max_digits:11'],
            'company' => ['required', 'string'],
        ];
    }

    public function messages()
    {
        return [
            'phone_num.min_digits' => 'The phone number must be 11 digits.',
            'phone_num.max_digits' => 'The phone number must be 11 digits.',
        ];
    }
}
