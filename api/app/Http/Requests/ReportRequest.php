<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReportRequest extends FormRequest
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
            'customer_code' => ['required','string','min:8'],
            'report_type' => ['required','string'],
            'warehouse' => ['string'],
            'group_by' => ['string','nullable'],
            'start_date' => ['date'],
            'end_date' => ['date'],
        ];
    }
}
