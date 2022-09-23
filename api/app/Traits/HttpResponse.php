<?php

namespace App\Traits;

trait HttpResponse
{
    /**
     * sendResponse
     *
     * @param  string $message
     * @param  mixed $data data to be encoded into json format
     * @param  int $code default 200 (ok)
     * @param  array $headers
     * @return json_encode $result
     */
    public function sendResponse($message, $data = [], $code = 200, $headers = [])
    {
        $response = [
            'status' => 'success',
            'data' => $data,
            'message' => $message
        ];
        return response()->json($response, $code, $headers);
    }

    /**
     * sendError
     *
     * @param  string $error
     * @param  int $code default to 500
     * @return json_encode $result
     */
    public function sendError($error,  $code = 500)
    {
        $response = [
            'status' => 'failed',
            'errors' => $error,
        ];
        return response()->json($response, $code);
    }
}
