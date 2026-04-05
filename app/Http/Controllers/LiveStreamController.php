<?php

namespace App\Http\Controllers;

use App\Actions\Media\UploadMediaAction;
use App\Http\Requests\LiveStreams\StoreLiveStreamRequest;
use App\Http\Requests\LiveStreams\UpdateLiveStreamRequest;
use App\Models\LiveStream;
use App\Support\YoutubeUrl;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class LiveStreamController extends Controller
{
    public function index(): Response
    {
        $streams = LiveStream::query()
            ->with('author:id,name')
            ->latest()
            ->get();

        return Inertia::render('live-streams', [
            'streams' => $streams->map(fn (LiveStream $stream) => $this->transformTableItem($stream))->values(),
        ]);
    }

    public function show(LiveStream $liveStream): JsonResponse
    {
        $liveStream->loadMissing('author:id,name');

        return response()->json($this->transformTableItem($liveStream));
    }

    public function store(StoreLiveStreamRequest $request, UploadMediaAction $uploadMedia): RedirectResponse
    {
        [$youtubeUrl, $videoId, $embedUrl, $iframeHtml] = $this->normalizeYoutubeData(
            $request->input('youtube_url'),
            $request->input('youtube_video_id'),
            $request->input('iframe_html'),
        );

        $thumbnailPath = $request->hasFile('thumbnail_image')
            ? $uploadMedia->execute($request->file('thumbnail_image'), config('media.live_streams.thumbnails_directory', 'uploads/live-streams/thumbnails'))
            : null;

        LiveStream::query()->create([
            'user_id' => $request->user()->id,
            'title' => $request->string('title')->toString(),
            'short_description' => $request->filled('short_description') ? $request->string('short_description')->toString() : null,
            'description' => $request->filled('description') ? $request->string('description')->toString() : null,
            'platform' => 'youtube',
            'youtube_url' => $youtubeUrl,
            'youtube_video_id' => $videoId,
            'embed_url' => $embedUrl,
            'iframe_html' => $iframeHtml,
            'thumbnail_url' => $thumbnailPath,
            'status' => $request->string('status')->toString(),
            'is_active' => $request->boolean('is_active'),
            'is_featured' => $request->boolean('is_featured'),
            'scheduled_at' => $request->date('scheduled_at'),
            'started_at' => $request->date('started_at'),
            'ended_at' => $request->date('ended_at'),
            'sort_order' => $request->integer('sort_order'),
            'views_count' => $request->integer('views_count'),
        ]);

        return redirect()
            ->route('live-streams.index')
            ->with('success', 'Transmision creada correctamente.');
    }

    public function update(UpdateLiveStreamRequest $request, LiveStream $liveStream, UploadMediaAction $uploadMedia): RedirectResponse
    {
        [$youtubeUrl, $videoId, $embedUrl, $iframeHtml] = $this->normalizeYoutubeData(
            $request->input('youtube_url'),
            $request->input('youtube_video_id'),
            $request->input('iframe_html'),
        );

        $thumbnailPath = $request->hasFile('thumbnail_image')
            ? $uploadMedia->execute($request->file('thumbnail_image'), config('media.live_streams.thumbnails_directory', 'uploads/live-streams/thumbnails'))
            : $liveStream->thumbnail_url;

        $liveStream->update([
            'title' => $request->string('title')->toString(),
            'short_description' => $request->filled('short_description') ? $request->string('short_description')->toString() : null,
            'description' => $request->filled('description') ? $request->string('description')->toString() : null,
            'platform' => 'youtube',
            'youtube_url' => $youtubeUrl,
            'youtube_video_id' => $videoId,
            'embed_url' => $embedUrl,
            'iframe_html' => $iframeHtml,
            'thumbnail_url' => $thumbnailPath,
            'status' => $request->string('status')->toString(),
            'is_active' => $request->boolean('is_active'),
            'is_featured' => $request->boolean('is_featured'),
            'scheduled_at' => $request->date('scheduled_at'),
            'started_at' => $request->date('started_at'),
            'ended_at' => $request->date('ended_at'),
            'sort_order' => $request->integer('sort_order'),
            'views_count' => $request->integer('views_count'),
        ]);

        return redirect()
            ->route('live-streams.index')
            ->with('success', 'Transmision actualizada correctamente.');
    }

    public function toggleStatus(LiveStream $liveStream): RedirectResponse
    {
        $liveStream->update([
            'is_active' => ! $liveStream->is_active,
        ]);

        return redirect()
            ->back()
            ->with('success', $liveStream->is_active ? 'Transmision activada correctamente.' : 'Transmision desactivada correctamente.');
    }

    private function transformTableItem(LiveStream $stream): array
    {
        return [
            'id' => $stream->id,
            'title' => $stream->title,
            'slug' => $stream->slug,
            'short_description' => $stream->short_description,
            'description' => $stream->description,
            'platform' => $stream->platform,
            'youtube_url' => $stream->youtube_url,
            'youtube_video_id' => $stream->youtube_video_id,
            'embed_url' => $stream->embed_url,
            'iframe_html' => $stream->iframe_html,
            'thumbnail_url' => $this->mediaUrl($stream->thumbnail_url),
            'status' => $stream->status,
            'is_active' => $stream->is_active,
            'is_featured' => $stream->is_featured,
            'scheduled_at' => $stream->scheduled_at?->format('Y-m-d\TH:i'),
            'started_at' => $stream->started_at?->format('Y-m-d\TH:i'),
            'ended_at' => $stream->ended_at?->format('Y-m-d\TH:i'),
            'sort_order' => $stream->sort_order,
            'views_count' => $stream->views_count,
            'created_at' => $stream->created_at?->toDateTimeString(),
            'updated_at' => $stream->updated_at?->toDateTimeString(),
            'author' => $stream->author ? [
                'id' => $stream->author->id,
                'name' => $stream->author->name,
            ] : null,
        ];
    }

    private function normalizeYoutubeData(?string $youtubeUrl, ?string $youtubeVideoId, ?string $iframeHtml): array
    {
        $iframeHtml = filled($iframeHtml) ? trim($iframeHtml) : null;
        $youtubeUrl = filled($youtubeUrl) ? trim($youtubeUrl) : null;
        $youtubeVideoId = filled($youtubeVideoId) ? trim($youtubeVideoId) : null;
        $videoId = YoutubeUrl::extractVideoId($youtubeUrl, $youtubeVideoId, $iframeHtml);
        $youtubeUrl = $youtubeUrl ?? "https://www.youtube.com/watch?v={$videoId}";
        $embedUrl = "https://www.youtube.com/embed/{$videoId}";

        return [$youtubeUrl, $videoId, $embedUrl, $iframeHtml];
    }

    private function mediaUrl(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }

        /** @var FilesystemAdapter $disk */
        $disk = Storage::disk(config('media.disk', 'public'));

        return $disk->url($path);
    }
}
