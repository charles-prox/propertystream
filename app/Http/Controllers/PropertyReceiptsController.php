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
}
