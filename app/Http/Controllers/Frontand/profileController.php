<?php

namespace App\Http\Controllers\Frontand;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class profileController extends Controller
{
    public function index()
    {
        return Inertia::render('Frontend/Profile/Index', [
            'auth' => [
                'user' => auth()->user(),
            ],
        ]);
    }
}
