<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Support\SapRfc;
use App\Interfaces\IInventoryRepository;
use App\Repository\InventoryRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind('sap-rfc', function () {
            return new SapRfc('prd', 'Local');
        });
        $this->app->bind(IInventoryRepository::class, InventoryRepository::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}
