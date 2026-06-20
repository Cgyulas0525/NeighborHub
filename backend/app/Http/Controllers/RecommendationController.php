<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use App\Models\Recommendation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RecommendationController extends Controller
{
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'recommended_profile_id' => ['required', 'exists:profiles,id'],
            'service_id' => ['nullable', 'exists:services,id'],
            'product_id' => ['nullable', 'exists:products,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'text' => ['nullable', 'string', 'max:5000'],
        ]);

        $recommendation = Recommendation::query()->create([
            ...$validated,
            'recommender_user_id' => $request->user()->id,
            'status' => 'pending',
        ]);

        return response()->json($recommendation->load('profile'), 201);
    }

    public function forProfile(Profile $profile): JsonResponse
    {
        $items = $profile->recommendations()
            ->where('status', 'approved')
            ->with('recommender:id,name')
            ->latest()
            ->get();

        return response()->json($items);
    }
}
