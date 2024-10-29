<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Laravel\Fortify\Contracts\UpdatesUserProfileInformation;

class UpdateUserProfileInformation implements UpdatesUserProfileInformation
{
    /**
     * Validate and update the given user's profile information.
     *
     * @param  array<string, mixed>  $input
     */
    public function update(User $user, array $input): void
    {
        Validator::make($input, [
            'hris_id' => ['required', 'digits:8', 'numeric', Rule::unique('users')->ignore($user->hris_id, 'hris_id')],
            'user_id' => ['required', 'string', 'max:255'],
            'first_name' => ['required', 'string', 'max:255'],
            'middle_name' => ['nullable', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'position' => ['required', 'string', 'max:255'],
            'contact_no' => ['required', 'string', 'max:255'],
            // 'pro_code' => ['integer'],
            'employment_status' => ['required', 'string', 'max:255'],
            'office_id' => ['required', 'integer'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->hris_id, 'hris_id')],
            'photo' => ['nullable', 'mimes:jpg,jpeg,png', 'max:5120'],
            'password' => [
                'nullable',
                'string',
                'min:8',
                Rule::requiredIf($input['reset_password'] ?? false), // Make required if reset_password is true
            ],
            'password_confirmation' => [
                'nullable',
                'same:password',
                Rule::requiredIf($input['reset_password'] ?? false), // Make required if reset_password is true
            ],
        ])->validateWithBag('updateProfileInformation');

        if (isset($input['photo'])) {
            $user->updateProfilePhoto($input['photo']);
        }

        // Update password only if provided and different
        if (!empty($input['password']) && !Hash::check($input['password'], $user->password)) {
            $user->password = Hash::make($input['password']);
        }

        // Sync roles if provided
        if (!empty($input['role'])) {
            $user->syncRoles($input['role']);
        }

        if (
            $input['email'] !== $user->email &&
            $user instanceof MustVerifyEmail
        ) {
            $this->updateVerifiedUser($user, $input);
        } else {
            $user->forceFill([
                'hris_id' => $input['hris_id'],
                'user_id' => $input['user_id'],
                'first_name' => $input['first_name'],
                'middle_name' => $input['middle_name'],
                'last_name' => $input['last_name'],
                'position' => $input['position'],
                'contact_no' => $input['contact_no'],
                'employment_status' => $input['employment_status'],
                'office_id' => $input['office_id'],
                'email' => $input['email'],
            ])->save();
        }
    }

    /**
     * Update the given verified user's profile information.
     *
     * @param  array<string, string>  $input
     */
    protected function updateVerifiedUser(User $user, array $input): void
    {
        $user->forceFill([
            'name' => $input['name'],
            'email' => $input['email'],
            'email_verified_at' => null,
        ])->save();

        $user->sendEmailVerificationNotification();
    }
}
