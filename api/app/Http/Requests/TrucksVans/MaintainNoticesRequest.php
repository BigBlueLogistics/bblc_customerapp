<?php

namespace App\Http\Requests\TrucksVans;

use Illuminate\Foundation\Http\FormRequest;

class MaintainNoticesRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'customerCode' => ['required', 'string', 'size:8'],
            'fname' => ['nullable','string'],
            'lname' => ['nullable','string'],
            'emailAdd' => ['nullable', 'email'],
            'phoneNum' => ['required', 'regex:/^09[0-9]{9}$/'],
        ];
    }

    public function messages()
    {
        return [
            'phoneNum.regex' => 'Invalid format phone number must be E.g: 09xxxxxxxxx',
        ];
    }
}
