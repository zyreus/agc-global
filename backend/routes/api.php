<?php

use App\Http\Controllers\AdminPortalController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminAnnouncementController;
use App\Http\Controllers\AdminCrmController;
use App\Http\Controllers\AdminNewsletterController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\AiChatController;
use App\Http\Controllers\ChatLeadController;
use App\Http\Controllers\WebhookChannelController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\NewsletterController;
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

Route::post('/ai/chat', [AiChatController::class, 'respond']);

Route::get('/webhooks/messenger', [WebhookChannelController::class, 'messengerVerify']);
Route::post('/webhooks/messenger', [WebhookChannelController::class, 'messengerEvent']);
Route::get('/webhooks/whatsapp', [WebhookChannelController::class, 'whatsappVerify']);
Route::post('/webhooks/whatsapp', [WebhookChannelController::class, 'whatsappEvent']);
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
Route::post('/chat/lead', [ChatLeadController::class, 'store']);

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
    Route::get('/admin/crm/chatbot-analytics', [AdminCrmController::class, 'chatbotAnalytics']);
});
