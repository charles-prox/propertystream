<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyDetailsController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home');
})->middleware(['auth', 'verified'])->name('home');

Route::get('/reports', function () {
    return Inertia::render('Reports');
})->middleware(['auth', 'verified'])->name('reports');

Route::get('/forms/property-acknowledgement-receipt', function () {
    return Inertia::render('Forms/PropertyAcknowledgementReceipt');
})->middleware(['auth', 'verified'])->name('par');

// Route::get('/users', function () {
//     return Inertia::render('Users');
// })->middleware(['auth', 'verified'])->name('users');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::resource('users', UsersController::class);
    Route::get('/properties', [PropertyController::class, 'index'])->name('properties');
    Route::post('/properties/selected', [PropertyDetailsController::class, 'index'])->name('properties.selected');
    Route::post('/properties/details', [PropertyDetailsController::class, 'store'])->name('properties.details');
    Route::get('registration/form/get/offices&roles', [RegisteredUserController::class, 'getOfficesAndRoles'])->name('registration.get.offices&roles');
});

require __DIR__ . '/auth.php';
