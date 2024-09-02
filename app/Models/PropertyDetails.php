<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyDetails extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'property_id',
        'iac_no',
        'pr_no',
        'si_no',
        'dr_no',
        'po_no',
        'iar_no',
        'useful_time',
        'remarks',
        'added_by',
    ];
}
