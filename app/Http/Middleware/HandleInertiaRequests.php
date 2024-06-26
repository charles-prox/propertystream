<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $username = function (string $fname, string $mname, string $lname) {
            $middle_initial = $mname ? ucfirst($mname)[0] . "." : "";
            return ucfirst($fname) . " " . $middle_initial . " " . ucfirst($lname);
        };

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user() !== null ? [
                    'name' => $username($request->user()->first_name, $request->user()->middle_name, $request->user()->last_name),
                    'email' => $request->user()->email,
                    'position' => $request->user()->position,
                    // 'office'=> $office,
                ] : null
            ],
        ];
    }
}
