<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CacheControlMiddleware
{
    public function handle($request, Closure $next)
    {
        $response = $next($request);

        // Add cache control headers for static assets
        if (str_starts_with($request->path(), 'public')) {
            $response->header('Cache-Control', 'public, max-age=31536000');
        }

        return $response;
    }
}
