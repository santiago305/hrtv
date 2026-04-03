<?php

namespace App\Http\Requests\Ads;

use App\Models\Campaign;
use App\Models\CampaignSlotTarget;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateAdCreativeRequest extends StoreAdCreativeRequest
{
    public function rules(): array
    {
        return [
            'campaign_id' => ['required', 'integer', Rule::exists(Campaign::class, 'id')],
            'ad_slot_id' => ['required', 'integer', Rule::exists('ad_slots', 'id')],
            'title' => ['nullable', 'string', 'max:150'],
            'creative_file' => ['nullable', 'file', 'image', 'max:10240'],
            'target_url' => ['nullable', 'url', 'max:500'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'display_weight' => ['required', 'integer', 'min:1', 'max:100'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator): void {
                $campaignId = $this->integer('campaign_id');
                $slotId = $this->integer('ad_slot_id');

                if ($campaignId > 0 && $slotId > 0) {
                    $isTargeted = CampaignSlotTarget::query()
                        ->where('campaign_id', $campaignId)
                        ->where('ad_slot_id', $slotId)
                        ->where('is_active', true)
                        ->exists();

                    if (! $isTargeted) {
                        $validator->errors()->add('ad_slot_id', 'El espacio publicitario no esta asignado a la campana.');
                    }
                }

                if ($this->hasFile('creative_file') && getimagesize($this->file('creative_file')->getRealPath()) === false) {
                    $validator->errors()->add('creative_file', 'No se pudieron leer las dimensiones de la imagen.');
                }
            },
        ];
    }
}
