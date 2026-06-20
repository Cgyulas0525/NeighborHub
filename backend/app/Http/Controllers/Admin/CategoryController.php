<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Category::query()
            ->with('requestedBy:id,name')
            ->orderBy('name');

        if ($type = $request->string('type')->toString()) {
            $query->where('type', $type);
        }
        if ($q = $request->string('q')->toString()) {
            $query->where('name', 'like', '%'.$q.'%');
        }

        return response()->json($query->paginate(20));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $this->validated($request);
        $data['approval_status'] = 'approved';
        $data['active'] = $data['active'] ?? true;

        $category = Category::create($data);

        return response()->json($category, 201);
    }

    public function show(Category $category): JsonResponse
    {
        return response()->json($category->load('requestedBy:id,name'));
    }

    public function update(Request $request, Category $category): JsonResponse
    {
        $data = $this->validated($request, $category->id);
        $this->applyApprovalSideEffects($data);

        $category->update($data);

        return response()->json($category->fresh('requestedBy:id,name'));
    }

    public function destroy(Category $category): JsonResponse
    {
        $category->delete();

        return response()->json(['message' => 'Törölve.']);
    }

    private function validated(Request $request, ?int $id = null): array
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', Rule::unique('categories', 'slug')->ignore($id)],
            'type' => ['required', 'string', 'max:32'],
            'active' => ['sometimes', 'boolean'],
            'approval_status' => ['sometimes', Rule::in(['pending', 'approved', 'rejected'])],
        ]);

        $data['slug'] = $data['slug'] ?? Str::slug($data['name']);

        return $data;
    }

    /** @param array<string, mixed> $data */
    private function applyApprovalSideEffects(array &$data): void
    {
        if (! isset($data['approval_status'])) {
            return;
        }

        if ($data['approval_status'] === 'approved') {
            $data['active'] = true;
        } elseif ($data['approval_status'] === 'rejected') {
            $data['active'] = false;
        }
    }
}
