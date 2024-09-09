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
    public function index(Request $request)
    {
        $currentPage = (int)$request->input('current_page')>0? (int)$request->input('current_page'): 1; // 
        $perPage = (int)$request->input('per_page')>0?(int)$request->input('per_page'):10; // Number of users per page
        $sortBy = $request->input('sort_by', 'id:asc'); // Column to sort by (default to 'id' in ascending order)
        $searchKey = $request->input('search_key') ? $request->input('search_key'): ''; // Search key
        $modelType = (new User())->getMorphClass();

        // // Parse the sortBy parameter to get column and direction
        // list($sortColumn, $sortDirection) = explode(':', $sortBy);

        // // Validate sort direction
        // $sortDirection = in_array(strtolower($sortDirection), ['asc', 'desc']) ? strtolower($sortDirection) : 'asc';

        // // Query to fetch users
        // $query = User::query();

        // // Apply search filter if search key is provided
        // if ($searchKey) {
        //     $query->where(function ($query) use ($searchKey) {
        //         $query->where('first_name', 'like', "%$searchKey%")
        //             ->orWhere('last_name', 'like', "%$searchKey%")
        //             ->orWhere('hris_id', 'like', "%$searchKey%");
        //     });
        // }

        // // Apply sorting
        // $query->orderBy($sortColumn, $sortDirection);

        // // Select only specific columns
        // $query->select(
        //     'id',
        //     'hris_id',
        //     'first_name',
        //     'middle_name',
        //     'last_name',
        //     'position',
        //     'employment_status',
        //     'avatar',
        //     'account_status',
        // ); // Add other columns as needed

        // // Paginate the results
        // $users = $query->paginate($perPage, ['*'], 'page', $currentPage);
        $result= DB::select('SELECT get_users(?,?,?,?,?)', [$currentPage, $perPage, $sortBy, $searchKey, $modelType]);
        $users = json_decode($result[0]->get_users);


        return Inertia::render('Users', [
            'users' => $users,
        ]);
    }
}
