<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Service::query()
            ->with(['profile.city', 'category', 'city'])
            ->where('is_active', true)
            ->where('approval_status', 'approved')
            ->whereHas('profile', fn ($p) => $p->where('approval_status', 'approved'));

        if ($request->filled('city_id')) {
            $cityId = $request->integer('city_id');
            $query->whereHas('profile', fn ($p) => $p->where('city_id', $cityId));
        }
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }
        if ($q = $request->string('q')->toString()) {
            $query->where('title', 'like', '%'.$q.'%');
        }

        return response()->json($query->latest()->paginate(20));
    }

    public function store(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;
        abort_unless($profile, 403, 'Előbb hozd létre a profilodat.');

        $validated = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price_type' => ['nullable', 'string', 'max:32'],
            'price_from' => ['nullable', 'integer', 'min:0'],
            'price_to' => ['nullable', 'integer', 'min:0'],
            'city_id' => ['nullable', 'exists:cities,id'],
        ]);

        $service = $profile->services()->create([
            ...$validated,
            'slug' => ProfileController::makeSlug($validated['title'], $profile->id),
            'is_active' => true,
            'approval_status' => 'pending',
        ]);

        return response()->json($service->load(['category', 'city']), 201);
    }

    public function mine(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;
        abort_unless($profile, 403, 'Előbb hozd létre a profilodat.');

        $services = $profile->services()
            ->with(['category:id,name', 'city:id,name'])
            ->latest()
            ->get();

        return response()->json($services);
    }

    public function show(Service $service): JsonResponse
    {
        return response()->json($service->load(['profile.city', 'category', 'city']));
    }

    public function update(Request $request, Service $service): JsonResponse
    {
        $this->authorizeOwner($request, $service->profile_id);

        $validated = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price_type' => ['nullable', 'string', 'max:32'],
            'price_from' => ['nullable', 'integer', 'min:0'],
            'price_to' => ['nullable', 'integer', 'min:0'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $service->update($validated);

        return response()->json($service->fresh(['category', 'city']));
    }

    public function destroy(Request $request, Service $service): JsonResponse
    {
        $this->authorizeOwner($request, $service->profile_id);
        $service->delete();

        return response()->json(['message' => 'Törölve.']);
    }

    private function authorizeOwner(Request $request, int $profileId): void
    {
        $profile = $request->user()->profile;
        abort_unless($profile && ($profile->id === $profileId || $request->user()->isAdmin()), 403);
    }
}
