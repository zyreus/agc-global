<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| The React public site and admin UI are built to public/app.
| API routes live under /api (see routes/api.php).
|
*/

Route::get('/', function () {
    return redirect(url('/app/'));
});

Route::get('/app/{any?}', function (?string $any = null) {
    $index = public_path('app/index.html');
    if (! File::exists($index)) {
        abort(503, 'Public site build missing. Run: npm run build:vite');
    }

    return response()->file($index, [
        'Content-Type' => 'text/html; charset=UTF-8',
    ]);
})->where('any', '.*');
