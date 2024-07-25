<?php

namespace App\Http\Controllers;

use App\Models\PropertyDetails;
use App\Http\Requests\PropertyDetailsRequest;
use Illuminate\Http\Request;

class PropertyDetailsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(PropertyDetailsRequest $request)
    {
        $data = $request->validated(); // Automatically formats and validates the data
        //
        PropertyDetails::create($data);
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
