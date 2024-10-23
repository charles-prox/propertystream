<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Office;
use App\Http\Requests\UserRequest;
use Spatie\Permission\Models\Role;
use Illuminate\Database\QueryException;

class UserController extends Controller
{
    /**
     * Display the users page
     */
    public function index()
    {
        return Inertia::render('Users');
    }

    /**
     * Get paginated users with search and filter options
     */
    public function search(Request $request)
    {
        $currentPage = max((int)($request->input('current_page') ?? 1), 1);
        $perPage = max((int)($request->input('per_page') ?? 10), 1);
        $sortBy = $request->input('sort_by') ?? 'id:asc';
        $searchKey = $request->input('search_key') ?? '';
        $filters = $request->input('filters') ?? [];


        // $users = DB::selectOne('SELECT * FROM get_paginated_users(?,?,?,?,?,?)', [$currentPage, $perPage, $sortBy, $searchKey, json_encode($filters), $modelType]);
        // $users->rows = json_decode($users->rows, true);
        $users = User::getPaginatedUsers($currentPage, $perPage, $sortBy, $searchKey, $filters);

        return response()->json($users);
    }

    public function create()
    {
        return Inertia::render('Users', [
            'action' => 'create', // No user data for creating a new user
            'offices' => Office::all(),
            'roles' => Role::where('name', '!=', 'super-admin')->get(),
        ]);
    }

    public function edit($id)
    {
        // Fetch the user based on the slug
        $user = User::where('hris_id', $id)->firstOrFail();
        $user->role = $user->getRoleNames(); // Add user role to the user object

        return Inertia::render('Users', [
            'action' => 'edit', // Pass the user data for editing
            'user' => $user,
            'offices' => Office::all(),
            'roles' => Role::where('name', '!=', 'super-admin')->get(),
        ]);
    }

    public function store(UserRequest $request)
    {
        try {
            // Create a new user instance using mass assignment
            $user = User::create([
                'hris_id' => $request->hris_id,
                'user_id' => $request->user_id,
                'first_name' => $request->first_name,
                'middle_name' => $request->middle_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'position' => $request->position,
                'contact_no' => $request->contact_no,
                'employment_status' => $request->employment_status,
                'office_id' => $request->office_id,
                'password' => bcrypt($request->password), // Hash the password
            ])->assignRole($request->role);

            // Redirect or return response
            if ($user->id) {
                return Inertia::render('Users', [
                    'result' => 'success',
                    'action' => 'create', // No user data for creating a new user
                    'offices' => Office::all(),
                    'roles' => Role::where('name', '!=', 'super-admin')->get(),
                ]);
            }
        } catch (QueryException $e) {
            // Handle database errors
            return Inertia::render('Users', [
                'errors' => $e->getMessage(),
                'action' => 'create', // No user data for creating a new user
                'offices' => Office::all(),
                'roles' => Role::where('name', '!=', 'super-admin')->get(),
            ]);
        } catch (\Exception $e) {
            // Handle other exceptions
            return Inertia::render('Users', [
                'errors' => $e->getMessage(),
                'action' => 'create', // No user data for creating a new user
                'offices' => Office::all(),
                'roles' => Role::where('name', '!=', 'super-admin')->get(),
            ]);
            return redirect()->back()->withErrors(['error' => 'An error occurred: ' . $e->getMessage()])->withInput();
        }
    }

    public function destroy($id)
    {
        try {
            $user = User::where('hris_id', $id)->firstOrFail();
            $user->delete();

            // Redirect or return response
            return response()->json(['message' => 'User deleted successfully']);
        } catch (\Exception $e) {
            // Handle any exceptions
            return response()->json(['message' => 'An error occurred: ' . $e->getMessage()]);
        }
    }

    public function update(UserRequest $request, $id)
    {
        // Find the user by ID
        $user = User::findOrFail($id);

        // Update the user's attributes
        $user->hris_id = $request->hris_id;
        $user->user_id = $request->user_id;
        $user->first_name = $request->first_name;
        $user->middle_name = $request->middle_name;
        $user->last_name = $request->last_name;
        $user->email = $request->email;
        $user->position = $request->position;
        $user->contact_no = $request->contact_no;
        $user->employment_status = $request->employment_status;
        $user->office_id = $request->office_id;
        $user->account_status = $request->account_status;

        // Update the password only if it is provided
        if ($request->filled('password')) {
            $user->password = bcrypt($request->password); // Hash the password
        }

        // Update the user's role
        if ($request->filled('role')) {
            // Remove existing roles and assign the new role
            $user->syncRoles($request->role); // Use syncRoles to update the role
        }

        // Save the changes to the database
        $user->save();

        // Redirect or return response
        return response()->json(['message' => 'User updated successfully']);
    }
}
