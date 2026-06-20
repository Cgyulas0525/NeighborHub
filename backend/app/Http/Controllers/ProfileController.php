<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    public function me(Request $request): JsonResponse
    {
        $profile = $request->user()->profile()
            ->with(['city', 'skills'])
            ->first();

        return response()->json($profile);
    }

    public function updateMe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'display_name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:32'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'address_optional' => ['nullable', 'string', 'max:255'],
            'introduction' => ['nullable', 'string', 'max:5000'],
            'website' => ['nullable', 'url', 'max:2048'],
            'facebook_url' => ['nullable', 'url', 'max:2048'],
            'public_email' => ['nullable', 'email', 'max:255'],
            'is_service_provider' => ['sometimes', 'boolean'],
            'skill_ids' => ['sometimes', 'array'],
            'skill_ids.*' => ['integer', 'exists:skills,id'],
        ]);

        $user = $request->user();
        $skillIds = $validated['skill_ids'] ?? null;
        unset($validated['skill_ids']);

        $profile = Profile::query()->updateOrCreate(
            ['user_id' => $user->id],
            [
                ...$validated,
                'approval_status' => ($validated['is_service_provider'] ?? false) ? 'pending' : 'approved',
            ],
        );

        if ($skillIds !== null) {
            $profile->skills()->sync($skillIds);
        }

        if ($profile->is_service_provider && $user->role === 'user') {
            $user->update(['role' => 'provider']);
        }

        return response()->json($profile->load(['city', 'skills']));
    }

    public function show(Profile $profile): JsonResponse
    {
        $profile->load(['city', 'skills', 'services' => fn ($q) => $q->where('is_active', true), 'products' => fn ($q) => $q->where('is_active', true)]);

        return response()->json($profile);
    }

    public static function makeSlug(string $title, int $profileId): string
    {
        return Str::slug($title).'-'.$profileId;
    }
}
