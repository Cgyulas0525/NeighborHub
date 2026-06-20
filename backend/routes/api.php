<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
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

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{service}', [ServiceController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);
Route::get('/profiles/{profile}', [ProfileController::class, 'show']);
Route::get('/profiles/{profile}/recommendations', [RecommendationController::class, 'forProfile']);
Route::get('/questions', [QuestionController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/profile/me', [ProfileController::class, 'me']);
    Route::put('/profile/me', [ProfileController::class, 'updateMe']);

    Route::post('/services', [ServiceController::class, 'store']);
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);

    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);

    Route::post('/recommendations', [RecommendationController::class, 'store']);
    Route::post('/questions', [QuestionController::class, 'store']);
    Route::post('/questions/{question}/answers', [QuestionController::class, 'storeAnswer']);
});
