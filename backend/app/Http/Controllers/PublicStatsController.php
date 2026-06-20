<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Profile;
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
}
