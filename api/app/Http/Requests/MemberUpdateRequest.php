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
            'customer_code' => 'required', 'string', 'min:8', 'max:8',
            'fname' => 'required', 'string',
            'lname' => 'required', 'string',
            'email' => 'required',  'email', 'string',
            'company_name' => 'required', 'string',
            'is_verify' => Rule::in('true', 'false'),
            'is_active' => Rule::in('true', 'false'),
        ];
    }
}
