<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Profile::query()
            ->with(['user:id,name,email', 'city:id,name'])
            ->latest();

        if ($status = $request->string('status')->toString()) {
            $query->where('approval_status', $status);
        }
        if ($q = $request->string('q')->toString()) {
            $query->where(function ($sub) use ($q) {
                $sub->where('display_name', 'like', '%'.$q.'%')
                    ->orWhereHas('user', fn ($u) => $u->where('name', 'like', '%'.$q.'%')->orWhere('email', 'like', '%'.$q.'%'));
            });
        }

        return response()->json($query->paginate(20));
    }

    public function update(Request $request, Profile $profile): JsonResponse
    {
        $validated = $request->validate([
            'approval_status' => ['required', Rule::in(['pending', 'approved', 'rejected'])],
        ]);

        $profile->update($validated);

        return response()->json($profile->load(['user:id,name,email', 'city:id,name']));
    }

    public function destroy(Profile $profile): JsonResponse
    {
        $profile->delete();

        return response()->json(['message' => 'Törölve.']);
    }
}
