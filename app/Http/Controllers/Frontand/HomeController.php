<?php

namespace App\Http\Controllers\Frontand;

use App\Http\Controllers\Controller;

class HomeController extends Controller
{
    public function index()
    {
        return inertia('home');
    }
}
