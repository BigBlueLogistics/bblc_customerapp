<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\OrderItems;

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
        'apstat', 'transid', 'ernam',
        'pudat'
    ];

    protected static function boot()
    {
        parent::boot();

        // Auto fill the transaction ID with 
        // format of: <timestamp>-<user ID>
        if (auth()->check()) {
            self::creating(function ($model) {
                $model->transid = auth()->id(). '-' .Carbon::now()->timestamp;
            });
        }
    }

    public function withMapOrderDetails($request)
    {
        $collection = collect($request);

        return $collection->map(function ($field) {
            return [
                'transid' => $this->transid, 
                'lgnum' => $this->lgnum, 
                'matnr' => $field['material'],
                'quan'  => $field['qty'],
                'meinh' => $field['units'],
                'charg' => $field['batch'],
                'vfdat' => $field['expiry'],
            ];
        })->all();
    }


    public function toFormattedOrderDetails()
    {
        return [
            'id' => $this->id, 
            'transid' => $this->transid, 
            'ref_number' => $this->ponum, 
            'source_wh' => $this->lgnum, 
            'pickup_date' => $this->pudat, 
            'instruction' => $this->header,
            'allow_notify' => $this->miles,
            'requests' => $this->mapFieldOrderItems()
        ];
    }

    public function hasManyOrderItems()
    {
        return $this->hasMany(OrderItems::class, 'transid');
    }

    public function mapFieldOrderItems()
    {
        return $this->hasManyOrderItems->map(function($item){
            return [
                'id' => $item['id'],
                'material' => $item['matnr'],
                'qty' => $item['quan'],
                'units' => $item['meinh'],
                'batch' => $item['charg'],
                'expiry' => $item['vfdat'],
            ];
        });
    }
}
