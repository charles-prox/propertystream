<?php

namespace App\Http\Controllers;

use App\Models\PropertyReceipt;
use App\Models\ParGenerationLog;
use Illuminate\Http\Request;
use Carbon\Carbon;

class PropertyReceiptController extends Controller
{
    public function index()
    {
        // List all receipts
        return PropertyReceipt::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'property_number' => 'required|integer',
            'issued_at' => 'required|date',
            'user_ip' => 'required|ip',
            'device' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
        ]);

        // Generate new PAR number
        $parNumber = $this->generateParNumber();

        // Create the property receipt
        $propertyReceipt = PropertyReceipt::create([
            'par_number' => $parNumber,
            'user_id' => $request->user_id,
            'property_number' => $request->property_number,
            'issued_at' => $request->issued_at,
        ]);

        // Log the generation
        ParGenerationLog::create([
            'property_receipt_id' => $propertyReceipt->id,
            'user_id' => $propertyReceipt->user_id,
            'user_ip' => $request->user_ip,
            'device' => $request->device,
        ]);

        return response()->json([
            'par_number' => $parNumber,
            'par_number' => $parNumber,
        ], 201);
    }

    private function generateParNumber()
    {
        // Get the latest Property Receipt
        $latestReceipt = PropertyReceipt::latest('id')->first();
        $latestId = $latestReceipt ? $latestReceipt->id : 0;

        // Format the PAR number: PAR-YYYYMMDD-XXXX
        $date = Carbon::now()->format('Ymd');
        return 'PAR-' . $date . '-' . str_pad($latestId + 1, 4, '0', STR_PAD_LEFT);
    }
}
