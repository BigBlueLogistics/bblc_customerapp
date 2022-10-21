<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class SetDefaultPassword extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:set-global-pass-users';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update all users password to default assigned';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $defaultPassword = Hash::make('p0rt4l2022');
        $user = User::where('id', '>', 0)->update(['password' => $defaultPassword]);

        if ($user) {
            $this->info('Default password has been set to all users');
        } else {
            $this->error('Failed updating users password');
        }
    }
}
