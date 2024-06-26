<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UsersController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $currentPage = $request->input('current_page', 1); // 
        $perPage = $request->input('per_page', 10); // Number of users per page
        $sortBy = $request->input('sort_by', 'id:asc'); // Column to sort by (default to 'id' in ascending order)
        $searchKey = $request->input('search_key', ''); // Search key

        // Parse the sortBy parameter to get column and direction
        list($sortColumn, $sortDirection) = explode(':', $sortBy);

        // Validate sort direction
        $sortDirection = in_array(strtolower($sortDirection), ['asc', 'desc']) ? strtolower($sortDirection) : 'asc';

        // Query to fetch users
        $query = User::query();

        // Apply search filter if search key is provided
        if ($searchKey) {
            $query->where(function ($query) use ($searchKey) {
                $query->where('first_name', 'like', "%$searchKey%")
                    ->orWhere('last_name', 'like', "%$searchKey%")
                    ->orWhere('hris_id', 'like', "%$searchKey%");
            });
        }

        // Apply sorting
        $query->orderBy($sortColumn, $sortDirection);

        // Select only specific columns
        $query->select(
            'id',
            'hris_id',
            'first_name',
            'middle_name',
            'last_name',
            'position',
            'employment_status',
            'avatar',
            'account_status',
        ); // Add other columns as needed

        // Paginate the results
        $users = $query->paginate($perPage, ['*'], 'page', $currentPage);

        return Inertia::render('Users', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
