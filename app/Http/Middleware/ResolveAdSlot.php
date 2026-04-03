<?php

namespace App\Http\Middleware;

use App\Models\AdSlot;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ResolveAdSlot
{
    public function handle(Request $request, Closure $next): Response
    {
        $slotCode = (string) $request->route('slotCode');

        $slot = AdSlot::query()
            ->where('code', $slotCode)
            ->where('is_active', true)
            ->firstOrFail();

        $request->attributes->set('adSlot', $slot);

        return $next($request);
    }
}
