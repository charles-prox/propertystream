<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Inertia::share('session', function (Request $request) {
            return collect($request->session()->all())
                ->filter(function ($value, $key) {
                    return str_starts_with($key, 'form'); // Change the condition as needed
                });
        });
    }
}
