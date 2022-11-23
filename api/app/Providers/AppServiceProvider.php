<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Support\SapRfc;
use App\Interfaces\IInventoryRepository;
use App\Interfaces\IWarehouseRepository;
use App\Interfaces\IReportsRepository;
use App\Repository\InventoryRepository;
use App\Repository\WarehouseRepository;
use App\Repository\ReportsRepository;

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
        $this->app->bind(IWarehouseRepository::class, WarehouseRepository::class);
        $this->app->bind(IReportsRepository::class, ReportsRepository::class);
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
