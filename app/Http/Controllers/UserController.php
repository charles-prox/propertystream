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
        $currentPage = (int)$request->input('current_page') > 0 ? (int)$request->input('current_page') : 1; // 
        $perPage = (int)$request->input('per_page') > 0 ? (int)$request->input('per_page') : 10; // Number of users per page
        $sortBy = $request->input('sort_by') ? $request->input('sort_by') : 'id:asc'; // Column to sort by (default to 'id' in ascending order)
        $searchKey = $request->input('search_key') ? $request->input('search_key') : ''; // Search key
        $filters = $request->input('filters') ? $request->input('filters') : [];
        $modelType = (new User())->getMorphClass();

        $users = DB::selectOne('SELECT * FROM get_paginated_users(?,?,?,?,?,?)', [$currentPage, $perPage, $sortBy, $searchKey, json_encode($filters), $modelType]);
        $users->rows = json_decode($users->rows, true);

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
            return Inertia::render('Users', [
                'result' => 'success',
                'action' => 'delete',
            ]);
        } catch (\Exception $e) {
            // Handle any exceptions
            return Inertia::render('Users', [
                'errors' => $e->getMessage(),
            ]);
        }
    }
}
