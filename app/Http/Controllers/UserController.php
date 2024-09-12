<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\User;

class UserController extends Controller
{
    /**
     * Get all users
     */
    public function index()
    {

        $users = DB::selectOne('SELECT * FROM get_paginated_users()');
        $users->rows = json_decode($users->rows, true);
        // dd($users);

        return Inertia::render('Users', [
            'users' => $users,
        ]);
    }

    /**
     * Get all users
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
}
