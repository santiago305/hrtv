<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Inertia\Inertia;
use Inertia\Response;

class ContactMessageController extends Controller
{
    public function index(): Response
    {
        $messages = ContactMessage::query()
            ->latest()
            ->paginate(15)
            ->through(fn (ContactMessage $message) => [
                'id' => $message->id,
                'name' => $message->name,
                'email' => $message->email,
                'subject' => $message->subject,
                'message' => $message->message,
                'created_at' => $message->created_at?->toDateTimeString(),
            ]);

        return Inertia::render('contact-messages', [
            'messages' => $messages->items(),
            'messagesPagination' => [
                'page' => $messages->currentPage(),
                'limit' => $messages->perPage(),
                'total' => $messages->total(),
            ],
        ]);
    }
}
