<?php

namespace App\Http\Requests\Report;

use Illuminate\Foundation\Http\FormRequest;

class ScheduleRequest extends FormRequest
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
            'customer_code' => ['required', 'string', 'min:8'],
            'freqy' => ['string', 'required'],
            'invty1' => ['string', 'nullable'],
            'invty2' => ['string', 'nullable'],
            'invty3' => ['string', 'nullable'],
            'time1' => ['string', 'nullable'],
            'time2' => ['string', 'nullable'],
            'time3' => ['string', 'nullable'],
        ];
    }
}
