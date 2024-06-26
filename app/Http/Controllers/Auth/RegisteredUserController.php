<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Office;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Database\QueryException;
use Illuminate\Validation\ValidationException;

class RegisteredUserController extends Controller
{
    public function getOfficesAndRoles()
    {
        // Retrieve list of roles and offices
        $roles = Role::select('id', 'name')->get();
        $offices = Office::select('id', 'name')->get();

        // Return only the data
        return response()->json([
            'offices' => $offices,
            'roles' => $roles,
        ]);
    }
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/RegisterUser');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'hris_id' => 'unique:users,hris_id|required|string|size:8',
            'user_id' => 'unique:users,user_id|required|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'contact_no' => 'required|string|max:255',
            'employment_status' => 'required|string|max:255',
            'office_id' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'email' => 'required|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'hris_id' => $request->hris_id,
            'user_id' => $request->user_id,
            'first_name' => $request->first_name,
            'middle_name' => $request->middle_name,
            'last_name' => $request->last_name,
            'position' => $request->position,
            'contact_no' => $request->contact_no,
            'employment_status' => $request->employment_status,
            'office_id' => $request->office_id,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ])->assignRole($request->role);

        event(new Registered($user));

        // return response()->json([
        //     'message' => "Congratulations"
        // ]);
        return Redirect::route('users.index', [
            'users' => User::select(
                'id',
                'hris_id',
                'first_name',
                'middle_name',
                'last_name',
                'position',
                'employment_status',
                'avatar',
                'account_status',
            )->get(),
        ]);
    }
}
