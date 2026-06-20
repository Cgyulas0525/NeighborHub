<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CityController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = City::query()->orderBy('name');

        if ($q = $request->string('q')->toString()) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', '%'.$q.'%')
                    ->orWhere('county', 'like', '%'.$q.'%')
                    ->orWhere('postal_code', 'like', '%'.$q.'%');
            });
        }

        return response()->json($query->paginate(20));
    }

    public function store(Request $request): JsonResponse
    {
        $city = City::create($this->validated($request));

        return response()->json($city, 201);
    }

    public function show(City $city): JsonResponse
    {
        return response()->json($city);
    }

    public function update(Request $request, City $city): JsonResponse
    {
        $city->update($this->validated($request));

        return response()->json($city);
    }

    public function destroy(City $city): JsonResponse
    {
        $city->delete();

        return response()->json(['message' => 'Törölve.']);
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'county' => ['nullable', 'string', 'max:255'],
            'postal_code' => ['nullable', 'string', 'max:16'],
            'active' => ['boolean'],
        ]);
    }
}
