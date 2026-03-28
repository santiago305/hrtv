<?php

namespace App\Http\Controllers;

use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $currentUser = $request->user();

        $users = User::query()
            ->select(['id', 'name', 'email', 'role_id', 'is_active', 'email_verified_at', 'created_at', 'profile_photo_path'])
            ->excludeUser($currentUser?->id)
            ->with(['role:id,name,slug'])
            ->latest()
            ->paginate(20)
            ->withQueryString()
            ->through(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
                'role' => $user->role ? [
                    'id' => $user->role->id,
                    'name' => $user->role->name,
                    'slug' => $user->role->slug,
                ] : null,
                'is_active' => $user->is_active,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at?->toDateTimeString(),
            ]);

        $availableRoles = Role::query()
            ->orderBy('name')
            ->get(['id', 'name', 'slug'])
            ->filter(fn (Role $role) => $currentUser?->canManageRole($role))
            ->values();

        return Inertia::render('users', [
            'users' => $users->items(),
            'usersPagination' => [
                'page' => $users->currentPage(),
                'limit' => $users->perPage(),
                'total' => $users->total(),
            ],
            'roles' => $availableRoles,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        User::create([
            'name' => $request->string('name')->toString(),
            'email' => $request->string('email')->toString(),
            'password' => Hash::make($request->string('password')->toString()),
            'role_id' => $request->integer('role_id'),
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        return redirect()
            ->route('users.index')
            ->with('success', 'Usuario creado correctamente.');
    }

    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        abort_unless($request->user()?->canManageRole($user->role), 403);

        $user->update([
            'name' => $request->string('name')->toString(),
            'email' => $request->string('email')->toString(),
            'role_id' => $request->integer('role_id'),
        ]);

        return redirect()
            ->route('users.index', ['page' => $request->query('page')])
            ->with('success', 'Usuario actualizado correctamente.');
    }

    public function toggleStatus(Request $request, User $user): RedirectResponse
    {
        abort_unless($request->user()?->canManageRole($user->role), 403);

        if ($request->user()?->id === $user->id) {
            return redirect()
                ->route('users.index', ['page' => $request->query('page')])
                ->with('success', 'No puedes desactivar tu propio usuario.');
        }

        $user->update([
            'is_active' => ! $user->is_active,
        ]);

        return redirect()
            ->route('users.index', ['page' => $request->query('page')])
            ->with('success', $user->is_active ? 'Usuario activado correctamente.' : 'Usuario desactivado correctamente.');
    }
}
