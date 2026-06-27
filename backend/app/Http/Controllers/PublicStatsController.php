<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Profile;
use App\Models\Question;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class PublicStatsController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'providers' => Profile::query()
                ->where('is_service_provider', true)
                ->where('approval_status', 'approved')
                ->count(),
            'services' => Service::query()
                ->where('is_active', true)
                ->where('approval_status', 'approved')
                ->whereHas('profile', fn ($p) => $p->where('approval_status', 'approved'))
                ->count(),
            'products' => Product::query()
                ->where('is_active', true)
                ->where('approval_status', 'approved')
                ->whereHas('profile', fn ($p) => $p->where('approval_status', 'approved'))
                ->count(),
        ]);
    }

    public function recent(): JsonResponse
    {
        $since = now()->subDays(7);
        $items = collect();

        Profile::query()
            ->where('is_service_provider', true)
            ->where('approval_status', 'approved')
            ->where('created_at', '>=', $since)
            ->with('city:id,name')
            ->latest()
            ->limit(10)
            ->get(['id', 'display_name', 'city_id', 'created_at'])
            ->each(function (Profile $p) use ($items) {
                $items->push([
                    'type' => 'provider',
                    'id' => $p->id,
                    'title' => $p->display_name,
                    'subtitle' => $p->city?->name,
                    'created_at' => $p->created_at?->toIso8601String(),
                ]);
            });

        Service::query()
            ->where('is_active', true)
            ->where('approval_status', 'approved')
            ->where('created_at', '>=', $since)
            ->whereHas('profile', fn ($q) => $q->where('approval_status', 'approved'))
            ->with(['profile:id,display_name', 'category:id,name'])
            ->latest()
            ->limit(10)
            ->get(['id', 'profile_id', 'title', 'category_id', 'created_at'])
            ->each(function (Service $s) use ($items) {
                $items->push([
                    'type' => 'service',
                    'id' => $s->id,
                    'profile_id' => $s->profile_id,
                    'title' => $s->title,
                    'subtitle' => collect([$s->profile?->display_name, $s->category?->name])->filter()->join(' · '),
                    'created_at' => $s->created_at?->toIso8601String(),
                ]);
            });

        Product::query()
            ->where('is_active', true)
            ->where('approval_status', 'approved')
            ->where('created_at', '>=', $since)
            ->whereHas('profile', fn ($q) => $q->where('approval_status', 'approved'))
            ->with(['profile:id,display_name', 'category:id,name'])
            ->latest()
            ->limit(10)
            ->get(['id', 'title', 'price', 'unit', 'category_id', 'created_at'])
            ->each(function (Product $p) use ($items) {
                $price = $p->price !== null
                    ? number_format((int) $p->price, 0, '', ' ').' Ft'.($p->unit ? " / {$p->unit}" : '')
                    : null;
                $items->push([
                    'type' => 'product',
                    'id' => $p->id,
                    'title' => $p->title,
                    'subtitle' => collect([$p->profile?->display_name, $p->category?->name, $price])->filter()->join(' · '),
                    'created_at' => $p->created_at?->toIso8601String(),
                ]);
            });

        Question::query()
            ->where('status', 'open')
            ->where('created_at', '>=', $since)
            ->with(['user:id,name', 'city:id,name'])
            ->latest()
            ->limit(10)
            ->get(['id', 'title', 'user_id', 'city_id', 'created_at'])
            ->each(function (Question $q) use ($items) {
                $items->push([
                    'type' => 'question',
                    'id' => $q->id,
                    'title' => $q->title,
                    'subtitle' => collect([$q->city?->name, $q->user?->name])->filter()->join(' · '),
                    'created_at' => $q->created_at?->toIso8601String(),
                ]);
            });

        return response()->json([
            'items' => $items->sortByDesc('created_at')->values()->take(20)->all(),
        ]);
    }
}
