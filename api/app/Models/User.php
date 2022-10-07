<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Jobs\QueuedResetPasswordJob;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable; //HasFactory,

    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'fname', 'lname', 'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function sendPasswordResetNotification($token)
    {
        $uiUrl = env('APP_URL').':'.env('UI_PORT');
        $emailForPasswordReset = urlencode(self::getEmailForPasswordReset());
        $url = "{$uiUrl}/change-password?token={$token}&email={$emailForPasswordReset}";

        QueuedResetPasswordJob::dispatch($this, $url);
    }
}
