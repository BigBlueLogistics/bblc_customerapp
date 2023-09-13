<?php

namespace App\Jobs;

use App\Notifications\NotificationToAdmin;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Notification;

class JobNotificationToAdmin implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    private $recipients;

    private $newRegisteredEmail;

    private $url;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($recipients, $newRegisteredEmail, $url)
    {
        $this->recipients = $recipients;
        $this->newRegisteredEmail = $newRegisteredEmail;
        $this->url = $url;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        Notification::route('mail', $this->recipients)
            ->notify(new NotificationToAdmin($this->recipients, $this->newRegisteredEmail, $this->url));
    }
}
