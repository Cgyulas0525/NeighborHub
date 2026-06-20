<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Question::query()
            ->with(['user:id,name', 'city:id,name', 'category:id,name'])
            ->where('status', 'open');

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->integer('city_id'));
        }

        return response()->json($query->latest()->paginate(20));
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'city_id' => ['nullable', 'exists:cities,id'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:10000'],
        ]);

        $question = $request->user()->questions()->create([
            ...$validated,
            'status' => 'open',
        ]);

        return response()->json($question->load(['city', 'category:id,name']), 201);
    }

    public function storeAnswer(Request $request, Question $question): JsonResponse
    {
        $validated = $request->validate([
            'body' => ['required', 'string', 'max:10000'],
            'recommended_profile_id' => ['nullable', 'exists:profiles,id'],
        ]);

        $answer = $question->answers()->create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return response()->json($answer->load('user:id,name'), 201);
    }
}
