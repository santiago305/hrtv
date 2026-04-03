import type { SharedData } from '@/types';

export type AdvertiserItem = {
    id: number;
    name: string;
    company_name: string | null;
    document_type: string | null;
    document_number: string | null;
    contact_name: string | null;
    contact_phone: string | null;
    contact_email: string | null;
    notes: string | null;
    is_active: boolean;
    campaigns_count: number;
};

export type AdSlotItem = {
    id: number;
    code: string;
    name: string;
    page_type: string | null;
    size: string | null;
    banner_width: number;
    banner_height: number;
    description: string | null;
    is_active: boolean;
    creatives_count: number;
};

export type CampaignItem = {
    id: number;
    advertiser_id: number;
    name: string;
    start_date: string | null;
    end_date: string | null;
    status: string | null;
    priority_weight: number;
    impressions_count: number;
    clicks_count: number;
    notes: string | null;
    advertiser: { id: number; name: string } | null;
    slot_ids: number[];
};

export type CreativeItem = {
    id: number;
    campaign_id: number;
    ad_slot_id: number;
    title: string | null;
    file_url: string;
    target_url: string | null;
    width: number;
    height: number;
    file_size: number | null;
    alt_text: string | null;
    display_weight: number;
    impressions_count: number;
    clicks_count: number;
    is_active: boolean;
    campaign: { id: number; name: string; advertiser: { id: number; name: string } | null } | null;
    slot: { id: number; code: string; name: string; size: string | null; banner_width: number; banner_height: number } | null;
};

export type AdvertisingPageProps = SharedData & {
    advertisers: AdvertiserItem[];
    adSlots: AdSlotItem[];
    campaigns: CampaignItem[];
    creatives: CreativeItem[];
};

export type AdvertiserFormData = {
    name: string;
    company_name: string;
    document_type: string;
    document_number: string;
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    notes: string;
};

export type SlotFormData = {
    code: string;
    name: string;
    page_type: string;
    size: string;
    banner_width: string;
    banner_height: string;
    description: string;
};

export type CampaignFormData = {
    advertiser_id: string;
    name: string;
    start_date: string;
    end_date: string;
    status: string;
    priority_weight: number;
    notes: string;
    slot_ids: string[];
};

export type CreativeFormData = {
    campaign_id: string;
    ad_slot_id: string;
    title: string;
    target_url: string;
    alt_text: string;
    display_weight: number;
    creative_file: File | null;
};
