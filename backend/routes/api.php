<?php

use Illuminate\Http\Request;

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

use App\Helpers\Sideveloper;
Sideveloper::routeController('/auth','ApiAuthController');

Route::middleware(['jwt.verify'])->group(function () {
    Sideveloper::routeController('/main','ApiMainController');
    Sideveloper::routeController('/master','ApiMasterController');
    Sideveloper::routeController('/maintenance','ApiMtController');
    Sideveloper::routeController('/incident','ApiIncController');
    Sideveloper::routeController('/dashboard','ApiDashController');
    Sideveloper::routeController('/report','ApiReportController');
});
