<?php

// app/Helpers.php

use Illuminate\Support\Facades\DB;

// Helper function to generate unique codes
function generateUniqueCode($length = 5, $connection = 'pgsql')
{
    $characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    $code = '';
    $maxTries = 10;

    // Generate a unique code
    for ($i = 0; $i < $length; $i++) {
        $code .= $characters[rand(0, strlen($characters) - 1)];
    }

    // Check if the code exists in any office-related table
    $tries = 0;
    $query = DB::connection($connection);
    while (
        $query->table('office_divisions')->where('code', $code)->exists() ||
        $query->table('office_sections')->where('code', $code)->exists() ||
        $query->table('office_units')->where('code', $code)->exists()
    ) {
        // Regenerate the code if it already exists
        $code = '';
        for ($i = 0; $i < $length; $i++) {
            $code .= $characters[rand(0, strlen($characters) - 1)];
        }

        // Abort after maximum tries
        $tries++;
        if ($tries >= $maxTries) {
            throw new Exception('Failed to generate a unique code.');
        }
    }

    return $code;
}
