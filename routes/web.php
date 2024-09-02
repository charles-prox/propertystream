<?php

// use Illuminate\Foundation\Application;

use App\Http\Controllers\LoginController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyDetailsController;
use App\Http\Controllers\UpdateUserProfileController;
use App\Http\Controllers\RegisterAdminController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return redirect('/dashboard');
});

Route::middleware([
    'auth:sanctum',
    config('jetstream.auth_session'),
    'verified',
])->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('home');

    Route::prefix('account')->name('account.')->group(function () {
        Route::get('security', [UserProfileController::class, 'show'])->name('security');
        Route::get('profile', function () {
            return Inertia::render('Account/Profile');
        })->name('profile');
        Route::post('profile/update', [UpdateUserProfileController::class, 'update'])->middleware([config('fortify.auth_middleware', 'auth') . ':' . config('fortify.guard')])->name('profile.update');
    });

    Route::prefix('properties')->group(function () {
        Route::get('/', [PropertyController::class, 'index'])->name('properties');
        Route::post('selected', [PropertyDetailsController::class, 'index'])->name('properties.selected');
        Route::post(' details', [PropertyDetailsController::class, 'store'])->name('properties.details');
    });
});


Route::get('/register', [RegisterAdminController::class, 'create'])
    ->middleware(['guest'])
    ->name('register');

Route::get('/login', [LoginController::class, 'create'])
    ->middleware(['guest'])
    ->name('login');
