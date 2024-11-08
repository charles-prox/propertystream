<?php

namespace App\Http\Controllers;

use App\Http\Requests\PropertyDetailsRequest;
use App\Models\PropertyDetails;
use Illuminate\Http\Request;
use App\Traits\PropertyReceiptTrait;

class PropertyDetailsController extends Controller
{
    use PropertyReceiptTrait;
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $propertyDetails = $this->storeReceipt($request);

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
