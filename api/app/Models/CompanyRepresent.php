<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CompanyRepresent extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = 'company_represent';

    public $timestamps = false;

    protected $fillable = ['user_id', 'contact_no', 'customer_code', 'company', 'address'];
}
