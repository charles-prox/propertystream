<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class PropertyController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $url = 'http://172.22.122.90/api/v1/hardware';


        $url .= '?' . 'offset=' . (($request->input("current_page", 1) - 1) * $request->input("per_page", 10));
        $url .= '&' . 'limit=' . $request->input("per_page", 10);

        if ($request->filled("search_key")) {
            $url .= '&' . 'search=' . $request->input("search_key");
        }

        // if ($request->filled("sort_by")) {
        //     $url .= '&' . 'order='.$request->input("sort_by");
        // }


        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('API_TOKEN'),
            "Content-Type" => "application/json",
            'Accept' => 'application/json',
        ])->get($url);

        // Check if the response is successful
        if ($response->successful()) {

            return Inertia::render('Properties', [
                'properties' => $response->json(),
                'url' => $url
            ]);
        }

        // Handle errors
        return response()->json(['error' => 'Unable to fetch data'], $response->status());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
