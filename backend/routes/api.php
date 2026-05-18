<?php

use App\Http\Controllers\AdminPortalController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminAnnouncementController;
use App\Http\Controllers\AdminCrmController;
use App\Http\Controllers\AdminNewsletterController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AiChatController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\CookieConsentController;
use App\Http\Controllers\AdminPerformanceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('/privacy/cookie-config', [CookieConsentController::class, 'config']);
Route::post('/privacy/consent', [CookieConsentController::class, 'store']);

Route::post('/ai/chat', [AiChatController::class, 'respond']);
Route::post('/feedback', [FeedbackController::class, 'store']);
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::post('/newsletter/subscribe', [NewsletterController::class, 'subscribe']);
Route::get('/chat/messages/{sessionId}', function (string $sessionId) {
    return response()->json([
        'messages' => \App\Models\ChatMessage::query()
            ->where('session_id', $sessionId)
            ->orderBy('id')
            ->get(['id', 'role', 'message', 'created_at']),
    ]);
});
Route::post('/chat/lead', function (\Illuminate\Http\Request $request) {
    $data = $request->validate([
        'session_id' => ['required', 'string', 'max:120'],
        'name' => ['required', 'string', 'max:120'],
        'email' => ['required', 'email', 'max:190'],
        'phone' => ['nullable', 'string', 'max:60'],
        'company' => ['nullable', 'string', 'max:120'],
        'concern' => ['nullable', 'string', 'max:2000'],
    ]);

    \App\Models\ChatLead::query()->create([
        'session_id' => $data['session_id'],
        'name' => trim($data['name']),
        'email' => strtolower(trim($data['email'])),
        'phone' => isset($data['phone']) ? trim($data['phone']) : null,
        'company' => isset($data['company']) ? trim($data['company']) : null,
        'concern' => isset($data['concern']) ? trim($data['concern']) : null,
    ]);

    \App\Models\ChatConversation::query()->updateOrCreate(
        ['session_id' => $data['session_id']],
        ['last_message_at' => now()]
    );

    return response()->json(['ok' => true]);
});

Route::post('/admin/login', [AdminAuthController::class, 'login']);

Route::middleware(['auth:sanctum', 'ensure.admin'])->group(function () {
    Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
    Route::get('/admin/verify', [AdminAuthController::class, 'verify']);
    Route::get('/admin/overview', [AdminPortalController::class, 'overview']);
    Route::get('/admin/announcements', [AdminAnnouncementController::class, 'index']);
    Route::post('/admin/announcements', [AdminAnnouncementController::class, 'store']);
    Route::put('/admin/announcements/{announcement}', [AdminAnnouncementController::class, 'update']);
    Route::delete('/admin/announcements/{announcement}', [AdminAnnouncementController::class, 'destroy']);
    Route::get('/admin/newsletter/subscribers', [AdminNewsletterController::class, 'index']);
    Route::delete('/admin/newsletter/subscribers/{subscriber}', [AdminNewsletterController::class, 'destroy']);

    Route::get('/admin/crm/conversations', [AdminCrmController::class, 'conversations']);
    Route::get('/admin/crm/conversations/{sessionId}', [AdminCrmController::class, 'conversation']);
    Route::post('/admin/crm/conversations/{sessionId}/reply', [AdminCrmController::class, 'reply']);
    Route::post('/admin/crm/conversations/{sessionId}/status', [AdminCrmController::class, 'setStatus']);
    Route::post('/admin/crm/conversations/{sessionId}/archive', [AdminCrmController::class, 'archive']);
    Route::delete('/admin/crm/conversations/{sessionId}', [AdminCrmController::class, 'destroy']);

    Route::get('/admin/crm/leads', [AdminCrmController::class, 'leads']);
    Route::post('/admin/crm/leads/{lead}/status', [AdminCrmController::class, 'leadStatus']);
    Route::post('/admin/crm/leads/{lead}/archive', [AdminCrmController::class, 'leadArchive']);

    Route::get('/admin/crm/feedback', [AdminCrmController::class, 'feedback']);

    Route::get('/admin/performance', [AdminPerformanceController::class, 'overview']);
    Route::put('/admin/performance/cookie-settings', [AdminPerformanceController::class, 'updateCookieSettings']);
    Route::post('/admin/performance/cache/clear', [AdminPerformanceController::class, 'clearCache']);
    Route::post('/admin/performance/cache/optimize', [AdminPerformanceController::class, 'optimizeCache']);
    Route::post('/admin/performance/cache/warm', [AdminPerformanceController::class, 'warmCache']);
    Route::get('/admin/performance/consent-logs', [AdminPerformanceController::class, 'consentLogs']);
});
