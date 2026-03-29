<?php

namespace App\Http\Controllers\Settings;

use App\Actions\Media\UploadImageAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Update the user's profile settings.
     */
    public function update(ProfileUpdateRequest $request, UploadImageAction $uploadImageAction): RedirectResponse
    {
        $user = $request->user();
        $user->fill($request->safe()->except(['avatar', 'remove_avatar']));

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if ($request->boolean('remove_avatar') && $user->profile_photo_path) {
            Storage::disk(config('media.disk', 'public'))->delete($user->profile_photo_path);
            $user->profile_photo_path = null;
        }

        if ($request->hasFile('avatar')) {
            try {
                $newPath = $uploadImageAction->execute(
                    $request->file('avatar'),
                    'uploads/images/avatars'
                );
            } catch (RuntimeException $exception) {
                return back()->withErrors([
                    'avatar' => $exception->getMessage(),
                ]);
            }

            if ($user->profile_photo_path) {
                Storage::disk(config('media.disk', 'public'))->delete($user->profile_photo_path);
            }

            $user->profile_photo_path = $newPath;
        }

        $user->save();

        return to_route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
