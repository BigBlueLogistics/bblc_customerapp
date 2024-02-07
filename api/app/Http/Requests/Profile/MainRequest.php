<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class MainRequest extends FormRequest
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
            'phone_num' => ['required', 'numeric', 'min_digits:11', 'max_digits:11'],
            'van_status' => ['boolean'],
            'invnt_report' => ['boolean'],
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
