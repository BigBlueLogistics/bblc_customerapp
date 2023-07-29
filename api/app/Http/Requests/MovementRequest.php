<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MovementRequest extends FormRequest
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
            'warehouse_no' => 'required','string',
            'movement_type' => 'required','string',
            'material_code' => 'required','string',
            'coverage_date' => 'required','array',
            'coverage_date.*' => 'date',
            'customer_code' => 'nullable', 'string'
        ];
    }
}
