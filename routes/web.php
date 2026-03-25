<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('inicio');
})->name('home');

Route::get('/noticias', function () {
    $newsItems = [
        [
            'title' => 'HRTV enciende una nueva etapa digital',
            'slug' => 'hrtv-enciende-una-nueva-etapa-digital',
            'excerpt' => 'La plataforma da inicio a su presencia publica con una estructura enfocada en informacion, radio y contacto.',
            'content' => 'HRTV inicia una nueva etapa digital con un sitio pensado para presentar noticias, reforzar la seccion de radio y abrir canales directos de contacto con la audiencia. Esta primera version establece la base publica del proyecto para seguir creciendo con contenidos y funcionalidades.',
            'published_at' => '25 Mar 2026',
        ],
        [
            'title' => 'La seccion de noticias queda lista para crecer',
            'slug' => 'la-seccion-de-noticias-queda-lista-para-crecer',
            'excerpt' => 'El modulo publica un listado inicial y una vista de detalle preparada para futuras integraciones.',
            'content' => 'La pagina de noticias se preparo con dos vistas separadas: una para el listado general y otra para la lectura individual de cada noticia. Esto permite conectar datos reales mas adelante sin cambiar la estructura principal de navegacion.',
            'published_at' => '25 Mar 2026',
        ],
        [
            'title' => 'Radio, conocenos y contacto ya tienen base publica',
            'slug' => 'radio-conocenos-y-contacto-ya-tienen-base-publica',
            'excerpt' => 'Las paginas clave del sitio ya cuentan con su ruta publica y un contenido inicial sencillo.',
            'content' => 'Como parte del arranque del proyecto, se dejaron listas las paginas de radio, conocenos y contacto. Por ahora muestran contenido base, pero ya estan conectadas al enrutado principal del sitio para continuar el desarrollo desde una base ordenada.',
            'published_at' => '25 Mar 2026',
        ],
    ];

    return Inertia::render('noticias/NewsListing', [
        'newsItems' => $newsItems,
    ]);
})->name('news.index');

Route::get('/noticias/{slug}', function (string $slug) {
    $newsItems = [
        [
            'title' => 'HRTV enciende una nueva etapa digital',
            'slug' => 'hrtv-enciende-una-nueva-etapa-digital',
            'excerpt' => 'La plataforma da inicio a su presencia publica con una estructura enfocada en informacion, radio y contacto.',
            'content' => 'HRTV inicia una nueva etapa digital con un sitio pensado para presentar noticias, reforzar la seccion de radio y abrir canales directos de contacto con la audiencia. Esta primera version establece la base publica del proyecto para seguir creciendo con contenidos y funcionalidades.',
            'published_at' => '25 Mar 2026',
        ],
        [
            'title' => 'La seccion de noticias queda lista para crecer',
            'slug' => 'la-seccion-de-noticias-queda-lista-para-crecer',
            'excerpt' => 'El modulo publica un listado inicial y una vista de detalle preparada para futuras integraciones.',
            'content' => 'La pagina de noticias se preparo con dos vistas separadas: una para el listado general y otra para la lectura individual de cada noticia. Esto permite conectar datos reales mas adelante sin cambiar la estructura principal de navegacion.',
            'published_at' => '25 Mar 2026',
        ],
        [
            'title' => 'Radio, conocenos y contacto ya tienen base publica',
            'slug' => 'radio-conocenos-y-contacto-ya-tienen-base-publica',
            'excerpt' => 'Las paginas clave del sitio ya cuentan con su ruta publica y un contenido inicial sencillo.',
            'content' => 'Como parte del arranque del proyecto, se dejaron listas las paginas de radio, conocenos y contacto. Por ahora muestran contenido base, pero ya estan conectadas al enrutado principal del sitio para continuar el desarrollo desde una base ordenada.',
            'published_at' => '25 Mar 2026',
        ],
    ];

    $newsItem = collect($newsItems)->firstWhere('slug', $slug);

    abort_if(! $newsItem, 404);

    return Inertia::render('noticias/NewDetail', [
        'newsItem' => $newsItem,
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
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
