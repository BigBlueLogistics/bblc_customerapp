<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MemberUpdateRequest extends FormRequest
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
            'email' => ['required',  'email', 'string'],
            'is_verify' => ['boolean'],
            'is_active' => ['boolean'],
            'role_id' => ['numeric', 'nullable'],
            'van_status' => ['boolean'],
            'invnt_report' => ['boolean'],
            'companies' => ['required', 'array', 'min:1'],
            'companies.*.id' => ['nullable', 'integer'],
            'companies.*.customer_code' => ['required', 'string', 'size:8'],
            'companies.*.company' => ['required', 'string'],
            'delete_companies' => ['nullable', 'array'],
            'phone_num' => ['numeric', 'nullable', 'regex:/^09[0-9]{9}$/'],
        ];
    }

    public function attributes()
    {
        return [
            'role_id' => 'type',
        ];
    }

    public function messages()
    {
        return [
            'phone_num.regex' => 'Invalid format phone number must be E.g: 09xxxxxxxxx',
        ];
    }
}
