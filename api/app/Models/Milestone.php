<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Milestone extends Model
{
    use HasFactory;

    protected $table = 'milestone';

    protected $primaryKey = '[Index]';

    protected $fillable = [
        'customer', 'delivery', 'email',
        'phone_num', 'miles', 'miles_last',
    ];
}
