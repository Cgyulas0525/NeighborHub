<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class CategorySuggestionController extends Controller
{
    public function mine(Request $request): JsonResponse
    {
        $suggestions = Category::query()
            ->where('requested_by_user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get(['id', 'name', 'type', 'approval_status', 'created_at']);

        return response()->json($suggestions);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::in(['service', 'product'])],
        ]);

        $slug = Str::slug($validated['name']);
        $duplicate = Category::query()
            ->where('type', $validated['type'])
            ->where(function ($q) use ($validated, $slug) {
                $q->where('slug', $slug)->orWhere('name', $validated['name']);
            })
            ->first();

        if ($duplicate) {
            if ($duplicate->approval_status === 'approved' && $duplicate->active) {
                throw ValidationException::withMessages(['name' => 'Ez a kategória már létezik.']);
            }
            if ($duplicate->approval_status === 'pending') {
                throw ValidationException::withMessages(['name' => 'Ez a kategória már jóváhagyásra vár.']);
            }
        }

        $category = Category::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'type' => $validated['type'],
            'active' => false,
            'approval_status' => 'pending',
            'requested_by_user_id' => $request->user()->id,
        ]);

        return response()->json($category, 201);
    }
}
