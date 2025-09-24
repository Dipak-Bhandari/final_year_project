<?php

// namespace App\Http\Controllers;

// use Illuminate\Http\Request;
// use Illuminate\Support\Facades\Http;

// class ChatController extends Controller
// {
//     public function ask(Request $request)
//     {
//         $response = Http::post('http://localhost:8001/chat', [
//             'question' => $request->input('question'),
//         ]);
//         return response()->json($response->json());
//     }
// }



namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ChatController extends Controller
{
    public function ask(Request $request)
    {
        try {
            // Validate the request
            $request->validate([
                'question' => 'required|string|max:1000',
                'context_type' => 'sometimes|string|in:syllabus,question'
            ]);

            // Prepare the request payload
            $payload = [
                'question' => $request->input('question'),
                'context_type' => $request->input('context_type', 'syllabus'), // Default to syllabus
                'model' => 'phi:latest',
                'temperature' => 0.7
            ];

            // Make the request to the AI engine
            $response = Http::timeout(30)->post('http://localhost:8001/chat', $payload);

            if ($response->successful()) {
                $data = $response->json();
                return response()->json([
                    'success' => true,
                    'answer' => $data['answer'],
                    'model_used' => $data['model_used'] ?? 'phi:latest',
                    'response_time' => $data['response_time'] ?? null,
                    'context_chunks_used' => $data['context_chunks_used'] ?? null
                ]);
            } else {
                // Log the error
                Log::error('AI Engine Error', [
                    'status' => $response->status(),
                    'response' => $response->body(),
                    'question' => $request->input('question')
                ]);

                return response()->json([
                    'success' => false,
                    'error' => 'AI service temporarily unavailable. Please try again.',
                    'details' => $response->body()
                ], 500);
            }
        } catch (\Exception $e) {
            // Log the exception
            Log::error('Chat Controller Exception', [
                'message' => $e->getMessage(),
                'question' => $request->input('question'),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'error' => 'An error occurred while processing your request.',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available models from AI engine
     */
    public function getModels()
    {
        try {
            $response = Http::timeout(10)->get('http://localhost:8001/models');

            if ($response->successful()) {
                return response()->json($response->json());
            } else {
                return response()->json([
                    'error' => 'Failed to fetch models'
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Failed to get models', ['error' => $e->getMessage()]);
            return response()->json([
                'error' => 'Failed to fetch models'
            ], 500);
        }
    }

    /**
     * Get AI engine health status
     */
    public function getHealth()
    {
        try {
            $response = Http::timeout(10)->get('http://localhost:8001/health');

            if ($response->successful()) {
                return response()->json($response->json());
            } else {
                return response()->json([
                    'error' => 'AI engine health check failed'
                ], 500);
            }
        } catch (\Exception $e) {
            Log::error('Health check failed', ['error' => $e->getMessage()]);
            return response()->json([
                'error' => 'AI engine health check failed'
            ], 500);
        }
    }
}
