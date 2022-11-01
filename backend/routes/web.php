<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

use App\Helpers\Sideveloper;

Route::get('/',function(){
	// return redirect('dashboard');
	// $ip = $_SERVER['REMOTE_ADDR'];
	// return md5('MONICV22019-31-01 23:59:59'.$ip);
});

Sideveloper::routeController('/main','MainController');
Sideveloper::routeController('/auth','ApiAuthController');