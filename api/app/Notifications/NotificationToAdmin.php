<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotificationToAdmin extends Notification implements ShouldQueue
{
    use Queueable;

    private $recipient;

    private $newRegisteredEmail;

    private $url;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($recipient, $newRegisteredEmail, $url)
    {
        $this->recipient = $recipient;
        $this->newRegisteredEmail = $newRegisteredEmail;
        $this->url = $url;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Registered Customer Notification')
            ->greeting('Hi, a new registered customer on portal site')
            ->action($this->newRegisteredEmail, $this->url)
            ->line('Please check this account for verification.');

    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
