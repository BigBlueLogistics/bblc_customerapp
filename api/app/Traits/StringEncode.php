<?php

namespace App\Traits;

trait StringEncode
{
    public function convert_latin1_to_utf8_recursive($data)
    {
        if (is_string($data)) {
            return trim(mb_convert_encoding($data, 'UTF-8'));
        } elseif (is_array($data)) {
            $ret = [];
            foreach ($data as $i => $d) {
                $ret[$i] = $this->convert_latin1_to_utf8_recursive($d);
            }

            return $ret;
        } elseif (is_object($data)) {
            foreach ($data as $i => $d) {
                $data->$i = $this->convert_latin1_to_utf8_recursive($d);
            }

            return $data;
        } else {
            return $data;
        }
    }
}
