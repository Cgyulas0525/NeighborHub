<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Product::query()
            ->with(['profile.city', 'category', 'city'])
            ->where('is_active', true)
            ->where('approval_status', 'approved')
            ->whereHas('profile', fn ($p) => $p->where('approval_status', 'approved'));

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->integer('city_id'));
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
            'price' => ['nullable', 'integer', 'min:0'],
            'unit' => ['nullable', 'string', 'max:32'],
            'city_id' => ['nullable', 'exists:cities,id'],
        ]);

        $product = $profile->products()->create([
            ...$validated,
            'city_id' => $validated['city_id'] ?? $profile->city_id,
            'slug' => ProfileController::makeSlug($validated['title'], $profile->id),
            'is_active' => true,
            'approval_status' => 'pending',
        ]);

        return response()->json($product->load(['category', 'city']), 201);
    }

    public function mine(Request $request): JsonResponse
    {
        $profile = $request->user()->profile;
        abort_unless($profile, 403, 'Előbb hozd létre a profilodat.');

        $products = $profile->products()
            ->with(['category:id,name', 'city:id,name'])
            ->latest()
            ->get();

        return response()->json($products);
    }

    public function show(Product $product): JsonResponse
    {
        return response()->json($product->load(['profile.city', 'category', 'city']));
    }

    public function update(Request $request, Product $product): JsonResponse
    {
        $this->authorizeOwner($request, $product->profile_id);

        $validated = $request->validate([
            'category_id' => ['nullable', 'exists:categories,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['nullable', 'integer', 'min:0'],
            'unit' => ['nullable', 'string', 'max:32'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'is_active' => ['sometimes', 'boolean'],
        ]);

        $product->update($validated);

        return response()->json($product->fresh(['category', 'city']));
    }

    public function destroy(Request $request, Product $product): JsonResponse
    {
        $this->authorizeOwner($request, $product->profile_id);
        $product->delete();

        return response()->json(['message' => 'Törölve.']);
    }

    private function authorizeOwner(Request $request, int $profileId): void
    {
        $profile = $request->user()->profile;
        abort_unless($profile && ($profile->id === $profileId || $request->user()->isAdmin()), 403);
    }
}
