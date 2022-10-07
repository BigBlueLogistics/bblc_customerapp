<?php

namespace App\Traits;

trait HttpResponse
{
    /**
     * sendResponse
     *
     * @param  mixed  $data to be encoded into json format
     * @param  string  $message
     * @param  int  $code default 200 (ok)
     * @param  array  $headers
     * @return json_encode $result
     */
    public function sendResponse($data = [], $message = null, $code = 200, $headers = [])
    {
        $response = [
            'status' => 'success',
            'data' => $data,
            'message' => $message,
        ];

        return response()->json($response, $code, $headers);
    }

    /**
     * sendError
     *
     * @param  string  $error
     * @param  int  $code default to 500
     * @return json_encode $result
     */
    public function sendError($message, $code = 500)
    {
        $response = [
            'status' => 'failed',
            'message' => $message,
        ];

        return response()->json($response, $code);
    }
}
