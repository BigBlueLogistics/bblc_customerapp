<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderHeader extends Model
{
    use HasFactory;

    protected $table = 'order_header';

    protected $primaryKey = 'transid';

    protected $keyType = 'string';

    public $timestamps = false;

    protected $fillable = [
        'ponum', 'header', 'lgnum',
        'miles', 'erdat', 'ertim',
        'apstat', 'transid', 'ernam'
    ];

    protected static function boot()
    {
        parent::boot();

        // Auto fill the transaction ID with 
        // format of: <timestamp>-<user ID>
        if (auth()->check()) {
            self::creating(function ($model) {
                $model->transid = Carbon::now()->timestamp. '-' .auth()->id();
            });
        }
    }
}
