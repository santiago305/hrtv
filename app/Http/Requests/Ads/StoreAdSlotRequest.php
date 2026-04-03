<?php

namespace App\Http\Requests\Ads;

use App\Enums\AdPageType;
use App\Enums\AdSize;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreAdSlotRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        if ($this->filled('size') && ! $this->filled('banner_width') && ! $this->filled('banner_height')) {
            $size = AdSize::tryFrom((string) $this->input('size'));

            if ($size !== null) {
                $this->merge($size->dimensions());
            }
        }
    }

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'code' => ['required', 'string', 'max:80', 'alpha_dash', Rule::unique('ad_slots', 'code')],
            'name' => ['required', 'string', 'max:120'],
            'page_type' => ['required', Rule::in(AdPageType::values())],
            'size' => ['required', Rule::in(AdSize::values())],
            'banner_width' => ['required', 'integer', 'min:1'],
            'banner_height' => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string'],
        ];
    }
}
