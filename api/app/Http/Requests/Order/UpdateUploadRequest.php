<?php

namespace App\Http\Requests\Order;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUploadRequest extends FormRequest
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
            'attachment' => ['array', 'nullable'],
            'attachment.*' => ['required','mimes:xlsx,xlx','max:4096'],
            'attachmentDelete' => ['array', 'nullable'],
            'attachmentDelete.*' => ['required', 'string'],
        ];
    }
}
