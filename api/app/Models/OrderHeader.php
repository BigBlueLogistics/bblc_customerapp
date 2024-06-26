<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderHeader extends Model
{
    use HasFactory;

    const CREATED_AT = null;

    protected $table = 'order_header';

    protected $primaryKey = 'transid';

    protected $keyType = 'string';

    protected $fillable = [
        'ponum', 'header', 'lgnum',
        'miles', 'erdat', 'ertim',
        'apstat', 'transid', 'ernam',
        'pudat', 'kunnr', 'access',
        'vbeln', 'audat', 'podat',
        'apnam'
    ];

    protected $casts = [
        'updated_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();

        // Auto fill the transaction ID with
        // format of: <user ID>-<timestamp>
        if (auth()->check()) {
            self::creating(function ($model) {
                $model->transid = auth()->id().'-'.Carbon::now()->timestamp;
            });
        }
    }

    protected function lgnum(): Attribute
    {
        return Attribute::make(
            set: function ($value) {
                return str_replace('BB', 'WH', $value);
            },
        );
    }

    protected function miles(): Attribute
    {
        return Attribute::make(
            set: function ($value) {
                return $value == 'true' ? 1 : 0;
            },
            get: function ($value) {
                return $value == 1 ? true : false;
            }
        );
    }

    public function withMapOrderDetails($request)
    {
        $collection = collect($request);

        return $collection->map(function ($field) {
            return [
                'uuid' => $field['uuid'],
                'transid' => $this->transid,
                'lgnum' => $this->lgnum,
                'matnr' => $field['material'],
                'quan' => $field['qty'],
                'meinh' => $field['units'],
                'charg' => $field['batch'],
                'vfdat' => $field['expiry'],
                'created_at' => Carbon::now(),
                'remarks' => $field['remarks'] ?? null,
            ];
        })->all();
    }

    public function toFormattedOrderDetails()
    {
        $warehouseNo = str_replace('WH', 'BB', $this->lgnum);

        return [
            'id' => $this->id,
            'transid' => $this->transid,
            'ref_number' => $this->ponum,
            'source_wh' => $warehouseNo,
            'allow_notify' => $this->miles,
            'pickup_date' => $this->pudat,
            'instruction' => $this->header,
            'status' => $this->status->only(['id', 'name']),
            'requests' => $this->mapFieldOrderItems(),
        ];
    }

    public function hasManyOrderItems()
    {
        return $this->hasMany(OrderItems::class, 'transid');
    }

    public function mapFieldOrderItems()
    {
        return $this->hasManyOrderItems->map(function ($item) {
            $expiry = Carbon::parse($item['vfdat'])->format('m-d-Y');

            return [
                'uuid' => $item['uuid'],
                'material' => $item['matnr'],
                'qty' => $item['quan'],
                'units' => $item['meinh'],
                'batch' => $item['charg'],
                'expiry' => $expiry,
                'created_at' => $item['created_at'],
                'remarks' => $item['remarks'],
            ];
        });
    }

    public function status()
    {
        return $this->hasOne(OrderStatus::class, 'id', 'apstat');
    }
}
