<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\OfficeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UsersController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->middleware(['auth', 'verified'])->name('home');

Route::get('/reports', function () {
    return Inertia::render('Reports');
})->middleware(['auth', 'verified'])->name('reports');

// Route::get('/users', function () {
//     return Inertia::render('Users');
// })->middleware(['auth', 'verified'])->name('users');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('users', UsersController::class);
    Route::get('registration/form/get/offices&roles', [RegisteredUserController::class, 'getOfficesAndRoles'])->name('registration.get.offices&roles');
});

require __DIR__ . '/auth.php';
