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
            'warehouseNo'  => ['required', 'string'],
            'movementType' => ['required', 'string'],
            'materialCode' => ['required', 'string'],
            'customerCode' => ['required', 'string', 'size:8'],
            'coverageDate' => ['required', 'array'],
            'coverageDate.*' => ['date'],
        ];
    }
}
