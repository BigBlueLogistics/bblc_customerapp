<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\USERS\LoginController;
use App\Http\Controllers\USERS\RegisterController;
use App\Http\Controllers\USERS\ResetPasswordController;
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

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/login', [LoginController::class, 'authenticate']);
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/forgot-password', [ResetPasswordController::class, 'forgot'])->name('password.reset');
Route::post('/reset-password', [ResetPasswordController::class, 'reset']);
Route::get('/testoracle', [LoginController::class, 'testOracle']);
Route::get('/inventory/warehouse-list', [InventoryController::class, 'warehouseList']);
Route::get('/inventory/table', [InventoryController::class, 'table']);
