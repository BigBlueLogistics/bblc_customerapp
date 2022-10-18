<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyRepresent extends Model
{
    use HasFactory;

    protected $table = 'company_represent';

    protected $fillable = ['user_id', 'customer_code'];
}
