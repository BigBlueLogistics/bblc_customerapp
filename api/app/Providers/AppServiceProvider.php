<?php

namespace App\Providers;

use App\Interfaces\IIndicatorsRepository;
use App\Interfaces\IInventoryRepository;
use App\Interfaces\IMemberRepository;
use App\Interfaces\IMovementRepository;
use App\Interfaces\IOrderRepository;
use App\Interfaces\IReportsRepository;
use App\Interfaces\ITrucksVansRepository;
use App\Interfaces\IWarehouseRepository;
use App\Repository\IndicatorsRepository;
use App\Repository\InventoryRepository;
use App\Repository\MemberRepository;
use App\Repository\MovementRepository;
use App\Repository\OrderRepository;
use App\Repository\ReportsRepository;
use App\Repository\TrucksVansRepository;
use App\Repository\WarehouseRepository;
use App\Support\SapRfc;
use App\Support\SqlServerOptConnector;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind('sap-rfc', function () {
            return new SapRfc('prd', 'Local');
        });
        $this->app->bind('db.connector.sqlsrv', SqlServerOptConnector::class);
        $this->app->bind(IInventoryRepository::class, InventoryRepository::class);
        $this->app->bind(IWarehouseRepository::class, WarehouseRepository::class);
        $this->app->bind(IReportsRepository::class, ReportsRepository::class);
        $this->app->bind(IMemberRepository::class, MemberRepository::class);
        $this->app->bind(IOrderRepository::class, OrderRepository::class);
        $this->app->bind(IIndicatorsRepository::class, IndicatorsRepository::class);
        $this->app->bind(IMovementRepository::class, MovementRepository::class);
        $this->app->bind(ITrucksVansRepository::class, TrucksVansRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
