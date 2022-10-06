<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\WAREHOUSE\InventoryController;

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
Route::get('/auth/login', [AuthController::class, 'login'])->name('login');
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/reset-password', [AuthController::class, 'reset'])->name('password.reset');
Route::post('/auth/change-password', [AuthController::class, 'change']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/inventory/warehouse-list', [InventoryController::class, 'warehouseList']);
    Route::get('/inventory/table', [InventoryController::class, 'table']);
    Route::get('/auth/is-authenticated', [AuthController::class, 'isAuthenticated']);
});
