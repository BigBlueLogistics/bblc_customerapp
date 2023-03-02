<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class CreateRequest extends FormRequest
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
            'source_wh' => ['required','string'],
            'ref_number' => ['required','regex:/^[^\'%"]+$/i', 'max:12'],
            'pickup_date' => ['nullable','date'],
            'requests' => ['required', 'array'],
            'requests.*.uuid' => ['required', 'uuid'],
            'requests.*.material' => ['required', 'string'],
            'requests.*.qty' => ['required', 'numeric'],
            'requestsDelete' => ['nullable','array']
        ];
    }
}
