<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('inicio');
})->name('home');

Route::get('/noticias', function () {
    return Inertia::render('noticias/NewsListing');
})->name('news.index');

Route::get('/noticias/{slug}', function (string $slug) {
    return Inertia::render('noticias/NewDetail', [
        'slug' => $slug,
    ]);
})->name('news.show');

Route::get('/radio', function () {
    return Inertia::render('radio');
})->name('radio');

Route::get('/conocenos', function () {
    return Inertia::render('conocenos');
})->name('about');

Route::get('/contacto', function () {
    return Inertia::render('contacto');
})->name('contact');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('dashboard/users', [UserController::class, 'index'])->name('users.index');
    Route::post('dashboard/users', [UserController::class, 'store'])->name('users.store');
    Route::patch('dashboard/users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
