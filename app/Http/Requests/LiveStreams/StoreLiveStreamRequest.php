<?php

namespace App\Http\Requests\LiveStreams;

use App\Models\LiveStream;
use App\Support\YoutubeUrl;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreLiveStreamRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'platform' => $this->filled('platform') ? $this->string('platform')->toString() : 'youtube',
            'status' => $this->filled('status') ? $this->string('status')->toString() : LiveStream::STATUS_DRAFT,
            'is_active' => $this->boolean('is_active'),
            'is_featured' => $this->boolean('is_featured'),
            'views_count' => $this->filled('views_count') ? (int) $this->input('views_count') : 0,
            'sort_order' => $this->filled('sort_order') ? (int) $this->input('sort_order') : 0,
        ]);
    }

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description' => ['nullable', 'string'],
            'platform' => ['required', 'string', Rule::in(['youtube'])],
            'youtube_url' => ['nullable', 'string', 'max:500'],
            'youtube_video_id' => ['nullable', 'string', 'max:100', 'regex:/^[A-Za-z0-9_-]{6,20}$/'],
            'iframe_html' => ['nullable', 'string'],
            'thumbnail_image' => ['nullable', 'file', 'image', 'max:10240'],
            'status' => ['required', 'string', Rule::in(LiveStream::validStatuses())],
            'is_active' => ['boolean'],
            'is_featured' => ['boolean'],
            'scheduled_at' => ['nullable', 'date'],
            'started_at' => ['nullable', 'date'],
            'ended_at' => ['nullable', 'date'],
            'sort_order' => ['nullable', 'integer'],
            'views_count' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $currentStream = $this->route('liveStream');

                if (! $this->filled('youtube_url') && ! $this->filled('youtube_video_id') && ! $this->filled('iframe_html')) {
                    $validator->errors()->add('youtube_url', 'Debes ingresar una URL, iframe o video ID de YouTube.');
                }

                if (($this->filled('youtube_url') || $this->filled('youtube_video_id') || $this->filled('iframe_html'))
                    && YoutubeUrl::extractVideoId($this->input('youtube_url'), $this->input('youtube_video_id'), $this->input('iframe_html')) === null) {
                    $validator->errors()->add('youtube_url', 'No se pudo extraer un video ID valido desde los datos de YouTube.');
                }

                if ($this->input('status') === LiveStream::STATUS_SCHEDULED && ! $this->filled('scheduled_at')) {
                    $validator->errors()->add('scheduled_at', 'La fecha programada es obligatoria para transmisiones programadas.');
                }

                if ($this->filled('started_at') && $this->filled('ended_at') && strtotime((string) $this->input('ended_at')) < strtotime((string) $this->input('started_at'))) {
                    $validator->errors()->add('ended_at', 'La fecha de finalizacion no puede ser anterior al inicio.');
                }

                if ($this->input('status') === LiveStream::STATUS_LIVE) {
                    $otherLiveExists = LiveStream::query()
                        ->where('status', LiveStream::STATUS_LIVE)
                        ->when($currentStream !== null, fn ($query) => $query->whereKeyNot($currentStream->id))
                        ->exists();

                    if ($otherLiveExists) {
                        $validator->errors()->add('status', 'Solo puede haber una transmision en vivo a la vez.');
                    }
                }
            },
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'El titulo es obligatorio.',
            'title.max' => 'El titulo no debe superar los 255 caracteres.',
            'short_description.max' => 'La descripcion corta no debe superar los 500 caracteres.',
            'platform.in' => 'La plataforma seleccionada no es valida.',
            'youtube_video_id.regex' => 'El video ID de YouTube no tiene un formato valido.',
            'thumbnail_image.image' => 'La miniatura debe ser una imagen valida.',
            'status.in' => 'El estado seleccionado no es valido.',
            'scheduled_at.date' => 'La fecha programada no tiene un formato valido.',
            'started_at.date' => 'La fecha de inicio no tiene un formato valido.',
            'ended_at.date' => 'La fecha de finalizacion no tiene un formato valido.',
            'views_count.min' => 'Las visualizaciones no pueden ser negativas.',
        ];
    }
}
