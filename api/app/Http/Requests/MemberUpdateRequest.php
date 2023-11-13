<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

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
            'customer_code' => ['required', 'string', 'size:8'],
            'fname' => ['required', 'string'],
            'lname' => ['required', 'string'],
            'email' => ['required',  'email', 'string'],
            'company_name' => ['required', 'string'],
            'is_verify' => ['boolean'],
            'is_active' => ['boolean'],
            'role_id' => ['numeric', 'nullable'],
            'van_status' => ['boolean'],
            'invnt_report' => ['boolean'],
            'phone_num' => ['numeric', 'nullable', 'min_digits:11', 'max_digits:11'],
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
            'phone_num.min_digits' => 'The phone number must be 11 digits.',
            'phone_num.max_digits' => 'The phone number must be 11 digits.'
        ];
    }
}
