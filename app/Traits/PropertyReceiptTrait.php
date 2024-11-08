<?php

namespace App\Traits;

use App\Models\PropertyDetails;
use App\Models\PropertyReceipt;
use App\Models\FormGenerationLog;
use Illuminate\Http\Request;
use Carbon\Carbon;

trait PropertyReceiptTrait
{
    public function storeReceipt(Request $request)
    {
        $validated = $request->validate([
            'selected' => 'required|array',
            'selected.*.key' => 'exists:property_details,property_id', // Validate each property_id (key)
            'selected.*.receipt_type' => 'required|in:par,ics', // Validate that receipt_type is either "par" or "ics"
            'user_id' => 'required|exists:users,hris_id',
        ]);


        $propertyDetails = PropertyDetails::whereIn('property_id', collect($validated['selected'])->pluck('key'))->get();

        $propertyDetailsWithNumbers = [];

        foreach ($propertyDetails as $propertyDetail) {
            // Loop through the selected property details and their receipt types
            foreach ($validated['selected'] as $selectedProperty) {
                // Check if the current property detail matches the selected property key
                if ($propertyDetail->property_id == $selectedProperty['key']) {

                    // Generate either PAR or ICS number based on receipt type
                    if ($selectedProperty['receipt_type'] === 'par') {
                        $number = $this->generateParNumber($propertyDetail->property_id);
                    }
                    if ($selectedProperty['receipt_type'] === 'ics') {
                        $number = $this->generateIcsNumber($propertyDetail->property_id);
                    }

                    // Check if the generated number already exists in PropertyReceipt
                    $existingReceipt = PropertyReceipt::where('reference_number', $number)->first();

                    if (!$existingReceipt) {
                        // Store the receipt with the generated number if it doesn't already exist
                        $propertyReceipt = PropertyReceipt::create([
                            'reference_number' => $number,
                            'user_id' => $request->user_id,
                            'property_number' => $propertyDetail->property_id,
                            'issued_at' => now(),
                        ]);

                        // Log the generation
                        FormGenerationLog::create([
                            'property_receipt_id' => $propertyReceipt->id,
                            'user_id' => $propertyReceipt->user_id,
                            'user_ip' => $request->ip(),
                            'device' => $request->userAgent(),
                        ]);
                    }
                    // else {
                    //     // Log the generation if the receipt already exists
                    //     FormGenerationLog::create([
                    //         'property_receipt_id' => $existingReceipt->id,
                    //         'user_id' => $existingReceipt->user_id,
                    //         'user_ip' => $request->ip(),
                    //         'device' => $request->userAgent(),
                    //     ]);
                    // }

                    // Append the generated number to property details for the response
                    $propertyDetailWithNumber = $propertyDetail->toArray();
                    $propertyDetailWithNumber['form_number'] = $number;

                    // Add the updated property detail to the results array
                    $propertyDetailsWithNumbers[] = $propertyDetailWithNumber;

                    // Stop looping once the property is processed
                    break;
                }
            }
        }

        return $propertyDetailsWithNumbers;
    }


    private function generateParNumber($propertyNumber)
    {
        // Check if a receipt already exists for the given property_number
        $existingReceipt = PropertyReceipt::where('property_number', $propertyNumber)->where('reference_number', 'like', 'PAR-%')->first();

        if ($existingReceipt) {
            // If a receipt already exists, return its PAR number
            return $existingReceipt->reference_number;
        }

        // Get the latest Property Receipt
        $latestReceipt = PropertyReceipt::where('reference_number', 'like', 'PAR-%')->latest('id')->first();
        $latestId = $latestReceipt ? $latestReceipt->id : 0;

        // Format the PAR number: PAR-YYYYMMDD-XXXX
        $date = Carbon::now()->format('Ymd');
        return 'PAR-' . $date . '-' . str_pad($latestId + 1, 4, '0', STR_PAD_LEFT);
    }

    private function generateIcsNumber($propertyNumber)
    {
        // Check if a receipt already exists for the given property_number
        $existingReceipt = PropertyReceipt::where('property_number', $propertyNumber)->where('reference_number', 'like', 'ICS-%')->first();

        if ($existingReceipt) {
            // If a receipt already exists, return its PAR number
            return $existingReceipt->reference_number;
        }

        // Get the latest Property Receipt
        $latestReceipt = PropertyReceipt::where('reference_number', 'like', 'ICS-%')->latest('id')->first();
        $latestId = $latestReceipt ? $latestReceipt->id : 0;

        // Format the PAR number: PAR-YYYYMMDD-XXXX
        $date = Carbon::now()->format('Ymd');
        return 'ICS-' . $date . '-' . str_pad($latestId + 1, 4, '0', STR_PAD_LEFT);
    }
}
