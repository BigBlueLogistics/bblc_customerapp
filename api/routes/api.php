<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\MembersController;
use App\Http\Controllers\ReportsController;
use App\Http\Controllers\WarehouseController;
use App\Http\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public routes
Route::prefix('auth')->group(function () {
    Route::get('/login', [AuthController::class, 'login'])->name('login');
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/reset-password-link', [AuthController::class, 'resetLink'])->name('password.reset');
    Route::post('/reset-password', [AuthController::class, 'reset']);
});

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('auth')->group(function () {
        Route::get('/logout', [AuthController::class, 'logout']);
        Route::get('/is-authenticated', [AuthController::class, 'isAuthenticated']);
        Route::post('/change-password', [AuthController::class, 'changePass']);
    });

    Route::prefix('inventory')->group(function () {
        Route::get('/', [InventoryController::class, 'index']);
        Route::get('/export-excel', [InventoryController::class, 'export']);
    });

    Route::prefix('members')->group(function () {
        Route::get('/', [MembersController::class, 'index']);
        Route::get('/{id}', [MembersController::class, 'edit'])->whereNumber('id');
        Route::post('/update/{id}', [MembersController::class, 'update'])->whereNumber('id');
    });

    Route::prefix('reports')->group(function () {
        Route::get('/', [ReportsController::class, 'index']);
        Route::get('/export-excel', [ReportsController::class, 'export']);
    });

    Route::prefix('warehouse')->group(function () {
        Route::get('/list', [WarehouseController::class, 'list']);
    });

    Route::prefix('orders')->group(function(){
        Route::get('/material-description', [OrderController::class, 'materialAndDescription']);
        Route::get('/product-units', [OrderController::class, 'productUnits']);
        Route::get('/expiry-batch', [OrderController::class, 'expiryBatch']);

        Route::get('/', [OrderController::class, 'index']);
        Route::get('/{transid}',[OrderController::class, 'edit'])->where('transid','^[0-9]+-[0-9]{10}$');
        Route::post('/create', [OrderController::class, 'create']);
        Route::post('/update/{transid}', [OrderController::class, 'update'])->where('transid','^[0-9]+-[0-9]{10}$');
    });
});
