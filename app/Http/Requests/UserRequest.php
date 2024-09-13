<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
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
    public function rules()
    {
        return [
            'hris_id' => 'required|string|max:8|unique:users,hris_id,' . $this->hris_id, // Required HRIS ID, max length 8, unique in users table (ignore current user if editing)
            'user_id' => 'required|string|unique:users,user_id,' . $this->hris_id, // Required user ID, unique in users table (ignore current user if editing)
            'first_name' => 'required|string|max:255', // Required first name, max length 255
            'middle_name' => 'nullable|string|max:255', // Optional middle name, max length 255
            'last_name' => 'required|string|max:255', // Required last name, max length 255
            'email' => 'required|email|unique:users,email,' . $this->hris_id, // Required email, must be valid and unique in users table (ignore current user if editing)
            'position' => 'required|string|max:100', // Optional position, max length 100
            'contact_no' => 'required|string|max:15', // Optional contact number, max length 15
            'employment_status' => 'required|string|max:50', // Optional employment status, max length 50
            'office_id' => 'required|integer|exists:offices,id', // Optional office ID, must be an integer and exist in offices table
            'password' => 'required|string|min:8|confirmed', // Optional password, must be at least 8 characters if provided, and must match the confirmation field
            'password_confirmation' => 'required|string|min:8', // Optional password confirmation, must match the password if provided
            'role' => 'required|string|in:admin,user,viewer,property-accountable-officer', // Add role validation
        ];
    }
}
