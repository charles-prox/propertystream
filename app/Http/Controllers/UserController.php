<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Office;
use Spatie\Permission\Models\Role;
use Illuminate\Database\QueryException;
use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\UpdateUserProfileInformation;

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

    public function store(Request $request)
    {
        try {
            // Create a new user using Fortify's CreateNewUser action
            $register = new CreateNewUser();
            $user = $register->create($request->all());

            // Assign role if provided
            if ($request->has('role')) {
                $user->assignRole($request->role);
            }

            // Redirect or return response
            if ($user->id) {
                return back()->with('form', [
                    'result' => 'success',
                ]);
            }
        } catch (QueryException $e) {
            return back()->with('form', [
                'errors' => $e->getMessage(),
            ]);
        } catch (\Exception $e) {
            // Handle other exceptions
            return back()->with('form', [
                'result' => 'error',
                'errors' => $e->getMessage(),
            ]);
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

    public function update(Request $request, $id)
    {
        try {
            // Find user by ID
            $user = User::findOrFail($id);

            // Use Fortify's UpdateUserProfileInformation action
            $updateProfileAction = new UpdateUserProfileInformation();
            $updateProfileAction->update($user, $request->all());

            return back()->with('form', [
                'result' => 'success',
            ]);
        } catch (\Exception $e) {
            // Handle errors
            return back()->with('form', [
                'result' => 'error',
                'errors' => $e->getMessage(),
            ]);
        }
    }
}
