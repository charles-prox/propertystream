<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PropertyDetailsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $user = $this->user(); // Get the authenticated user

        // Check if the user has the 'admin' role or the 'edit articles' permission
        if ($user->hasRole('admin') || $user->hasRole('super-admin')) {
            return true;
        }

        // If the user doesn't have the required role or permission, deny access
        return false;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'property_id' => 'required|string',
            'iac_no' => 'required|string',
            'pr_no' => 'required|string',
            'si_no' => 'required|string',
            'dr_no' => 'required|string',
            'po_no' => 'required|string',
            'iar_no' => 'required|string',
            'useful_time' => 'required|integer',
            'remarks' => 'nullable|string',
            'added_by' => 'required|string',
        ];
    }
}
