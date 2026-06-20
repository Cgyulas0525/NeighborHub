<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Support\ProfileAvatarGenerator;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Str;

class ProfileController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Profile::query()
            ->where('is_service_provider', true)
            ->where('approval_status', 'approved')
            ->with(['city:id,name', 'skills:id,name'])
            ->withCount(['services' => fn ($q) => $q->where('is_active', true)->where('approval_status', 'approved')]);

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->integer('city_id'));
        }

        if ($request->filled('category_id')) {
            $categoryId = $request->integer('category_id');
            $query->whereHas('services', fn ($s) => $s->where('is_active', true)->where('category_id', $categoryId));
        }

        if ($q = $request->string('q')->toString()) {
            $query->where(function ($sub) use ($q) {
                $sub->where('display_name', 'like', '%'.$q.'%')
                    ->orWhere('introduction', 'like', '%'.$q.'%')
                    ->orWhereHas('services', fn ($s) => $s->where('is_active', true)->where('title', 'like', '%'.$q.'%'));
            });
        }

        return response()->json($query->orderBy('display_name')->paginate(20));
    }

    public function me(Request $request): JsonResponse
    {
        $profile = $request->user()->profile()
            ->with(['city', 'skills'])
            ->first();

        if ($profile) {
            $this->ensureProfileAvatar($profile);
        }

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

        $this->ensureProfileAvatar($profile);

        return response()->json($profile->load(['city', 'skills']));
    }

    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpeg,jpg,png,webp', 'max:4096'],
        ]);

        $user = $request->user();
        $profile = Profile::query()->firstOrCreate(
            ['user_id' => $user->id],
            ['display_name' => $user->name],
        );

        if ($profile->profile_image) {
            Storage::disk('public')->delete($profile->profile_image);
        }

        $path = $request->file('image')->store('profiles', 'public');
        $profile->update(['profile_image' => $path]);

        return response()->json($profile->fresh(['city', 'skills']));
    }

    private function ensureProfileAvatar(Profile $profile): void
    {
        if (! $profile->profile_image) {
            ProfileAvatarGenerator::assign($profile);

            return;
        }

        if (ProfileAvatarGenerator::isGeneratedPath($profile->profile_image) && $profile->wasChanged('display_name')) {
            ProfileAvatarGenerator::assign($profile);
        }
    }

    public function show(Profile $profile): JsonResponse
    {
        abort_unless(
            $profile->is_service_provider && $profile->approval_status === 'approved',
            404,
            'A szolgáltató nem található.',
        );

        $profile->load([
            'city',
            'skills',
            'services' => fn ($q) => $q
                ->where('is_active', true)
                ->where('approval_status', 'approved')
                ->with(['category:id,name', 'city:id,name'])
                ->orderBy('title'),
            'products' => fn ($q) => $q
                ->where('is_active', true)
                ->where('approval_status', 'approved')
                ->with(['category:id,name', 'city:id,name'])
                ->orderBy('title'),
        ]);

        return response()->json($profile);
    }

    public function avatar(Profile $profile): StreamedResponse
    {
        abort_unless($profile->profile_image, 404);
        abort_unless(Storage::disk('public')->exists($profile->profile_image), 404);

        return Storage::disk('public')->response($profile->profile_image);
    }

    public static function makeSlug(string $title, int $profileId): string
    {
        return Str::slug($title).'-'.$profileId;
    }
}
