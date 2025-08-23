<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class ChatController extends Controller
{
      public function ask(Request $request)
    {
        $response = Http::post('http://localhost:8001/chat', [
            'question' => $request->input('question'),
        ]);
        return response()->json($response->json());
    }
}
