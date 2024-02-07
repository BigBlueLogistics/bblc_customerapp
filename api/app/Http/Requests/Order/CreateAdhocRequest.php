<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class CreateAdhocRequest extends FormRequest
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
            'warehouse' => ['required', 'string'],
            'customerCode' => ['required', 'string', 'size:8'],
            'docNo' => ['required', 'string'],
            'createdDate' => ['required', 'string'],
            'createdTime' => ['required', 'string'],
            'soNum' => ['required', 'numeric'],
            'date' => ['required', 'string'],
        ];
    }
}
