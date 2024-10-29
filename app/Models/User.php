<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Laravel\Jetstream\HasProfilePhoto;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use HasApiTokens;
    use HasFactory;
    use HasProfilePhoto;
    use Notifiable;
    use HasRoles;
    use TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'hris_id',
        'user_id',
        'first_name',
        'middle_name',
        'last_name',
        'position',
        'contact_no',
        'employment_status',
        'office_id',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    /**
     * The accessors to append to the model's array form.
     *
     * @var array<int, string>
     */
    protected $appends = [
        'profile_photo_url',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Retrieve a paginated list of users with optional sorting, searching, and filtering.
     *
     * This static method allows for fetching users in a paginated format, enabling the caller
     * to specify the current page, number of users per page, sorting criteria, search keyword,
     * and additional filters. The results will be returned in a format suitable for display 
     * in a paginated view.
     *
     * @param int $currentPage The page number to retrieve (default is 1).
     * @param int $perPage The number of users to display per page (default is 10).
     * @param string $sortBy The sorting criteria, formatted as 'column:direction' (default is 'first_name:asc').
     * @param string $searchKey A search keyword to filter users by name or other searchable fields (default is an empty string).
     * @param array $filters An associative array of additional filters to apply when retrieving users (default is an empty array).
     * @return \Illuminate\Pagination\LengthAwarePaginator Returns a paginator instance containing the users for the specified page.
     */
    public static function getPaginatedUsers(
        int $currentPage = 1,
        int $perPage = 10,
        string $sortBy = 'first_name:asc',
        string $searchKey = '',
        array $filters = []
    ) {
        // Base query
        $query = self::with(['office', 'roles']) // Assuming relationships are defined
            ->select('users.*') // Select all user columns

            // Apply search filter
            ->when($searchKey, function (Builder $q) use ($searchKey) {
                $q->where(function (Builder $q) use ($searchKey) {
                    $q->where('users.first_name', 'ILIKE', '%' . $searchKey . '%')
                        ->orWhere('users.last_name', 'ILIKE', '%' . $searchKey . '%');
                });
            });

        // Apply filters from the filters array
        foreach ($filters as $filter) {
            if (isset($filter['dbColumn'])) {
                foreach ($filter['dbColumn'] as $dbColumn) {
                    $filterValue = $filter['value'] ?? '';
                    $query->orWhere(function (Builder $q) use ($dbColumn, $filterValue) {
                        switch ($dbColumn) {
                            case 'office_name':
                                $q->whereHas('office', fn($q) => $q->where('name', 'ILIKE', '%' . $filterValue . '%'));
                                break;
                            case 'office_address':
                                $q->whereHas('office', fn($q) => $q->where('address', 'ILIKE', '%' . $filterValue . '%'));
                                break;
                            case 'office_acronym':
                                $q->whereHas('office', fn($q) => $q->where('acronym', 'ILIKE', '%' . $filterValue . '%'));
                                break;
                            case 'office_pro':
                                $q->whereHas('office', fn($q) => $q->where('pro', 'ILIKE', '%' . $filterValue . '%'));
                                break;
                            case 'office_type':
                                $q->whereHas('office', fn($q) => $q->where('type', 'ILIKE', '%' . $filterValue . '%'));
                                break;
                            case 'roles':
                                $q->whereHas('roles', fn($q) => $q->where('name', 'ILIKE', '%' . $filterValue . '%'));
                                break;
                            default:
                                $q->where('users.' . $dbColumn, 'ILIKE', '%' . $filterValue . '%');
                                break;
                        }
                    });
                }
            }
        }

        // Sorting
        [$sortField, $sortDirection] = explode(':', $sortBy);
        $query->orderBy('users.' . $sortField, $sortDirection);

        // Paginate results
        $users = $query->paginate($perPage, ['*'], 'page', $currentPage);

        // Format the results to include only role names
        $formattedRows = collect($users->items())->map(function ($user) {
            // Return the user with all existing properties and modified roles
            return [
                ...$user->toArray(), // Spread the user attributes
                'roles' => $user->roles->pluck('name')->toArray(), // Get role names as an array
            ];
        });

        // Format the results
        return [
            'current_page' => $users->currentPage(),
            'per_page' => $users->perPage(),
            'total_users' => $users->total(),
            'total_pages' => $users->lastPage(),
            'rows' => $formattedRows,
        ];
    }

    public function office(): BelongsTo
    {
        return $this->belongsTo(Office::class, 'office_id');
    }
}
