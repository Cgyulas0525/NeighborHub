<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\City;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReferenceDataController extends Controller
{
    public function cities(): JsonResponse
    {
        return response()->json(
            City::query()->where('active', true)->orderBy('name')->get(['id', 'name', 'county', 'postal_code'])
        );
    }

    public function categories(Request $request): JsonResponse
    {
        $query = Category::query()
            ->where('active', true)
            ->where('approval_status', 'approved')
            ->orderBy('name');
        if ($type = $request->string('type')->toString()) {
            $query->where('type', $type);
        }

        return response()->json($query->get(['id', 'name', 'slug', 'type']));
    }

    public function skills(Request $request): JsonResponse
    {
        $query = Skill::query()->where('active', true)->with('category:id,name,slug')->orderBy('name');
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->integer('category_id'));
        }
        if ($q = $request->string('q')->toString()) {
            $query->where('name', 'like', '%'.$q.'%');
        }

        return response()->json($query->get(['id', 'name', 'slug', 'category_id']));
    }
}
