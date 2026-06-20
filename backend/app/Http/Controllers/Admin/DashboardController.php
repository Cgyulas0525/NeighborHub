<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\City;
use App\Models\Product;
use App\Models\Profile;
use App\Models\Question;
use App\Models\Recommendation;
use App\Models\Service;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class DashboardController extends Controller
{
    public function stats(): JsonResponse
    {
        return response()->json([
            'users' => User::count(),
            'profiles' => Profile::count(),
            'profiles_pending' => Profile::where('approval_status', 'pending')->count(),
            'services' => Service::count(),
            'services_pending' => Service::where('approval_status', 'pending')->count(),
            'products' => Product::count(),
            'products_pending' => Product::where('approval_status', 'pending')->count(),
            'questions' => Question::count(),
            'recommendations_pending' => Recommendation::where('status', 'pending')->count(),
            'cities' => City::count(),
            'categories' => Category::count(),
            'categories_pending' => Category::where('approval_status', 'pending')->count(),
            'skills' => Skill::count(),
        ]);
    }
}
