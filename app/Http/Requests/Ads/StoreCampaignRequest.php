<?php

namespace App\Http\Requests\Ads;

use App\Enums\CampaignStatus;
use App\Models\Advertiser;
use App\Models\AdSlot;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreCampaignRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        $this->merge([
            'priority_weight' => $this->filled('priority_weight') ? (int) $this->input('priority_weight') : 1,
            'slot_ids' => array_values(array_filter((array) $this->input('slot_ids', []), static fn ($id) => $id !== null && $id !== '')),
        ]);
    }

    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'advertiser_id' => ['required', 'integer', Rule::exists(Advertiser::class, 'id')],
            'name' => ['required', 'string', 'max:150'],
            'start_date' => ['required', 'date'],
            'end_date' => ['required', 'date', 'after_or_equal:start_date'],
            'status' => ['required', Rule::in(CampaignStatus::values())],
            'priority_weight' => ['required', 'integer', 'min:1', 'max:100'],
            'notes' => ['nullable', 'string'],
            'slot_ids' => ['required', 'array', 'min:1'],
            'slot_ids.*' => ['integer', Rule::exists(AdSlot::class, 'id')],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $uniqueSlotIds = array_unique(array_map('intval', (array) $this->input('slot_ids', [])));

                if (count($uniqueSlotIds) !== count((array) $this->input('slot_ids', []))) {
                    $validator->errors()->add('slot_ids', 'No puedes repetir espacios publicitarios en la misma campana.');
                }
            },
        ];
    }
}
