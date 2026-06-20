<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = User::query()->orderByDesc('id');

        if ($role = $request->string('role')->toString()) {
            $query->where('role', $role);
        }
        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }
        if ($q = $request->string('q')->toString()) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', '%'.$q.'%')
                    ->orWhere('email', 'like', '%'.$q.'%');
            });
        }

        return response()->json(
            $query->paginate(20, ['id', 'name', 'email', 'role', 'status', 'created_at'])
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::min(8)],
            'role' => ['required', Rule::in(['user', 'provider', 'admin'])],
            'status' => ['required', Rule::in(['active', 'suspended', 'pending'])],
        ]);

        $user = User::create($validated);

        return response()->json($this->present($user), 201);
    }

    public function show(User $user): JsonResponse
    {
        return response()->json($this->present($user));
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', Password::min(8)],
            'role' => ['sometimes', Rule::in(['user', 'provider', 'admin'])],
            'status' => ['sometimes', Rule::in(['active', 'suspended', 'pending'])],
        ]);

        if (empty($validated['password'])) {
            unset($validated['password']);
        }

        $user->update($validated);

        return response()->json($this->present($user->fresh()));
    }

    public function destroy(Request $request, User $user): JsonResponse
    {
        abort_if($request->user()->id === $user->id, 422, 'Saját fiók nem törölhető.');
        $user->delete();

        return response()->json(['message' => 'Törölve.']);
    }

    private function present(User $user): array
    {
        return $user->only(['id', 'name', 'email', 'role', 'status', 'created_at']);
    }
}
