<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyRepresent extends Model
{
    use HasFactory;

    protected $table = 'company_represent';

    public $timestamps = false;

    protected $fillable = ['user_id', 'contact_no', 'customer_code', 'company', 'address'];

    protected function customerCode(): Attribute
    {
        return Attribute::make(
            set: function ($value) {
                return strtoupper($value);
            },
            get: function ($value) {
                return strtoupper($value);
            }
        );
    }
}
