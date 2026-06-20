<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Question;
use App\Models\Recommendation;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContentController extends Controller
{
    public function services(Request $request): JsonResponse
    {
        $query = Service::query()->with(['profile:id,display_name', 'category:id,name', 'city:id,name'])->latest();
        if ($q = $request->string('q')->toString()) {
            $query->where('title', 'like', '%'.$q.'%');
        }

        return response()->json($query->paginate(20));
    }

    public function serviceUpdate(Request $request, Service $service): JsonResponse
    {
        $service->update($request->validate([
            'approval_status' => ['required', Rule::in(['pending', 'approved', 'rejected'])],
        ]));

        return response()->json($service);
    }

    public function serviceDestroy(Service $service): JsonResponse
    {
        $service->delete();

        return response()->json(['message' => 'Törölve.']);
    }

    public function products(Request $request): JsonResponse
    {
        $query = Product::query()->with(['profile:id,display_name', 'category:id,name', 'city:id,name'])->latest();
        if ($q = $request->string('q')->toString()) {
            $query->where('title', 'like', '%'.$q.'%');
        }

        return response()->json($query->paginate(20));
    }

    public function productUpdate(Request $request, Product $product): JsonResponse
    {
        $product->update($request->validate([
            'approval_status' => ['required', Rule::in(['pending', 'approved', 'rejected'])],
        ]));

        return response()->json($product);
    }

    public function productDestroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json(['message' => 'Törölve.']);
    }

    public function questions(Request $request): JsonResponse
    {
        $query = Question::query()->with(['user:id,name', 'city:id,name'])->latest();
        if ($q = $request->string('q')->toString()) {
            $query->where('title', 'like', '%'.$q.'%');
        }

        return response()->json($query->paginate(20));
    }

    public function questionUpdate(Request $request, Question $question): JsonResponse
    {
        $question->update($request->validate([
            'status' => ['required', Rule::in(['open', 'closed'])],
        ]));

        return response()->json($question);
    }

    public function questionDestroy(Question $question): JsonResponse
    {
        $question->delete();

        return response()->json(['message' => 'Törölve.']);
    }

    public function recommendations(Request $request): JsonResponse
    {
        $query = Recommendation::query()
            ->with(['recommender:id,name', 'profile:id,display_name'])
            ->latest();
        if ($status = $request->string('status')->toString()) {
            $query->where('status', $status);
        }

        return response()->json($query->paginate(20));
    }

    public function recommendationUpdate(Request $request, Recommendation $recommendation): JsonResponse
    {
        $recommendation->update($request->validate([
            'status' => ['required', Rule::in(['pending', 'approved', 'rejected'])],
        ]));

        return response()->json($recommendation);
    }

    public function recommendationDestroy(Recommendation $recommendation): JsonResponse
    {
        $recommendation->delete();

        return response()->json(['message' => 'Törölve.']);
    }
}
