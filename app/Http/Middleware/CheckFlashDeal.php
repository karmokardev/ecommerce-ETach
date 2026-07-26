<?php

namespace App\Http\Middleware;

use App\Models\FlashSale;
use Closure;
use Illuminate\Http\Request;

class CheckFlashDeal
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        // Get active flash sale
        $activeFlashSale = FlashSale::active()
            ->with(['products.product.images', 'products.product.variants', 'products.variant'])
            ->orderBy('priority', 'desc')
            ->first();

        // Share with all views and controllers
        view()->share('activeFlashSale', $activeFlashSale);
        $request->attributes->set('activeFlashSale', $activeFlashSale);

        return $next($request);
    }
}
