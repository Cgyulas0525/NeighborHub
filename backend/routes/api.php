<?php

use App\Http\Controllers\Admin\CategoryController as AdminCategoryController;
use App\Http\Controllers\Admin\CityController as AdminCityController;
use App\Http\Controllers\Admin\ContentController as AdminContentController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\ProfileController as AdminProfileController;
use App\Http\Controllers\Admin\SkillController as AdminSkillController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategorySuggestionController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicStatsController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\ReferenceDataController;
use App\Http\Controllers\ServiceController;
use Illuminate\Support\Facades\Route;

Route::get('/cities', [ReferenceDataController::class, 'cities']);
Route::get('/categories', [ReferenceDataController::class, 'categories']);
Route::get('/skills', [ReferenceDataController::class, 'skills']);

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/stats', [PublicStatsController::class, 'index']);
Route::get('/recent', [PublicStatsController::class, 'recent']);
Route::get('/providers', [ProfileController::class, 'index']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{service}', [ServiceController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/profiles/{profile}/avatar', [ProfileController::class, 'avatar']);
Route::get('/profiles/{profile}', [ProfileController::class, 'show']);
Route::get('/profiles/{profile}/recommendations', [RecommendationController::class, 'forProfile']);
Route::get('/questions', [QuestionController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/profile/me', [ProfileController::class, 'me']);
    Route::get('/profile/me/services', [ServiceController::class, 'mine']);
    Route::get('/profile/me/products', [ProductController::class, 'mine']);
    Route::put('/profile/me', [ProfileController::class, 'updateMe']);
    Route::post('/profile/image', [ProfileController::class, 'uploadImage']);

    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    Route::post('/recommendations', [RecommendationController::class, 'store']);
    Route::post('/questions', [QuestionController::class, 'store']);
    Route::post('/questions/{question}/answers', [QuestionController::class, 'storeAnswer']);

    Route::get('/category-suggestions/mine', [CategorySuggestionController::class, 'mine']);
    Route::post('/category-suggestions', [CategorySuggestionController::class, 'store']);
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [AdminDashboardController::class, 'stats']);

    Route::apiResource('cities', AdminCityController::class);
    Route::apiResource('categories', AdminCategoryController::class);
    Route::apiResource('skills', AdminSkillController::class);
    Route::apiResource('users', AdminUserController::class);

    Route::get('/profiles', [AdminProfileController::class, 'index']);
    Route::put('/profiles/{profile}', [AdminProfileController::class, 'update']);
    Route::delete('/profiles/{profile}', [AdminProfileController::class, 'destroy']);

    Route::get('/services', [AdminContentController::class, 'services']);
    Route::put('/services/{service}', [AdminContentController::class, 'serviceUpdate']);
    Route::delete('/services/{service}', [AdminContentController::class, 'serviceDestroy']);

    Route::get('/products', [AdminContentController::class, 'products']);
    Route::put('/products/{product}', [AdminContentController::class, 'productUpdate']);
    Route::delete('/products/{product}', [AdminContentController::class, 'productDestroy']);

    Route::get('/questions', [AdminContentController::class, 'questions']);
    Route::put('/questions/{question}', [AdminContentController::class, 'questionUpdate']);
    Route::delete('/questions/{question}', [AdminContentController::class, 'questionDestroy']);

    Route::get('/recommendations', [AdminContentController::class, 'recommendations']);
    Route::put('/recommendations/{recommendation}', [AdminContentController::class, 'recommendationUpdate']);
    Route::delete('/recommendations/{recommendation}', [AdminContentController::class, 'recommendationDestroy']);
});
