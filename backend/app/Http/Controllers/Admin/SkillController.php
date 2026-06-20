<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class SkillController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Skill::query()->with('category:id,name')->orderBy('name');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }
        if ($q = $request->string('q')->toString()) {
            $query->where('name', 'like', '%'.$q.'%');
        }

        return response()->json($query->paginate(20));
    }

    public function store(Request $request): JsonResponse
    {
        $skill = Skill::create($this->validated($request));

        return response()->json($skill->load('category:id,name'), 201);
    }

    public function show(Skill $skill): JsonResponse
    {
        return response()->json($skill->load('category:id,name'));
    }

    public function update(Request $request, Skill $skill): JsonResponse
    {
        $skill->update($this->validated($request, $skill->id));

        return response()->json($skill->fresh('category:id,name'));
    }

    public function destroy(Skill $skill): JsonResponse
    {
        $skill->delete();

        return response()->json(['message' => 'Törölve.']);
    }

    private function validated(Request $request, ?int $id = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('skills', 'slug')->ignore($id)],
            'category_id' => ['nullable', 'exists:categories,id'],
            'active' => ['boolean'],
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        return $data;
    }
}
