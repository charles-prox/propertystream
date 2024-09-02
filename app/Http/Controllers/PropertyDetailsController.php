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
        // Validate the incoming request
        $validated = $request->validate([
            'selected' => 'required|array',
            'selected.*' => 'exists:property_details,property_id', // Make sure to validate each ID
        ]);

        $propertyDetails = PropertyDetails::whereIn('property_id', $validated['selected'])->get();

        return response()->json($propertyDetails);
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
}
