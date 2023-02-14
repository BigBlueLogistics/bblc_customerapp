<?php

namespace App\Providers;

use App\Interfaces\IInventoryRepository;
use App\Interfaces\IMemberRepository;
use App\Interfaces\IReportsRepository;
use App\Interfaces\IWarehouseRepository;
use App\Interfaces\IOrderRepository;
use App\Repository\InventoryRepository;
use App\Repository\MemberRepository;
use App\Repository\ReportsRepository;
use App\Repository\WarehouseRepository;
use App\Repository\OrderRepository;
use App\Support\SapRfc;
use Illuminate\Support\ServiceProvider;

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
        $this->app->bind(IMemberRepository::class, MemberRepository::class);
        $this->app->bind(IOrderRepository::class, OrderRepository::class);
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
