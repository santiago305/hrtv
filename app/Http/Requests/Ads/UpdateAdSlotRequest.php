<?php

namespace App\Http\Requests\Ads;

use Illuminate\Validation\Rule;

class UpdateAdSlotRequest extends StoreAdSlotRequest
{
    public function rules(): array
    {
        $adSlot = $this->route('adSlot');

        return [
            ...parent::rules(),
            'code' => ['required', 'string', 'max:80', 'alpha_dash', Rule::unique('ad_slots', 'code')->ignore($adSlot?->id)],
        ];
    }
}
