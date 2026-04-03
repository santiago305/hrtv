import { useLocalPagination } from '@/components/pagination/use-local-pagination';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { CAMPAIGN_STATUSES } from './advertising/constants';
import { AdvertiserFormCard } from './advertising/components/advertiser-form-card';
import { AdvertisersTableCard } from './advertising/components/advertisers-table-card';
import { CampaignFormCard } from './advertising/components/campaign-form-card';
import { CampaignsTableCard } from './advertising/components/campaigns-table-card';
import { ControlSection } from './advertising/components/control-section';
import { CreativeFormCard } from './advertising/components/creative-form-card';
import { CreativesTableCard } from './advertising/components/creatives-table-card';
import { SizeGuideCard } from './advertising/components/size-guide-card';
import { SlotFormCard } from './advertising/components/slot-form-card';
import { SlotsTableCard } from './advertising/components/slots-table-card';
import { AD_SIZES } from './advertising/constants';
import type {
    AdSlotItem,
    AdvertiserFormData,
    AdvertiserItem,
    AdvertisingPageProps,
    CampaignFormData,
    CampaignItem,
    CreativeFormData,
    CreativeItem,
    SlotFormData,
} from './advertising/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Publicidad', href: '/dashboard/ads' },
];

export default function AdvertisingPage() {
    const { advertisers, adSlots, campaigns, creatives } = usePage<AdvertisingPageProps>().props;

    const [selectedAdvertiser, setSelectedAdvertiser] = useState<AdvertiserItem | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<AdSlotItem | null>(null);
    const [selectedCampaign, setSelectedCampaign] = useState<CampaignItem | null>(null);
    const [selectedCreative, setSelectedCreative] = useState<CreativeItem | null>(null);
    const [creativePreview, setCreativePreview] = useState<string[]>([]);
    const [creativeResetKey, setCreativeResetKey] = useState(0);

    const advertiserForm = useForm<AdvertiserFormData>({
        name: '',
        company_name: '',
        document_type: '',
        document_number: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        notes: '',
    });

    const slotForm = useForm<SlotFormData>({
        code: '',
        name: '',
        page_type: '',
        size: '',
        banner_width: '',
        banner_height: '',
        description: '',
    });

    const campaignForm = useForm<CampaignFormData>({
        advertiser_id: '',
        name: '',
        start_date: '',
        end_date: '',
        status: 'draft',
        priority_weight: 10,
        notes: '',
        slot_ids: [],
    });

    const creativeForm = useForm<CreativeFormData>({
        campaign_id: '',
        ad_slot_id: '',
        title: '',
        target_url: '',
        alt_text: '',
        display_weight: 1,
        creative_file: null,
    });

    useEffect(() => {
        if (!selectedAdvertiser) return void advertiserForm.reset();
        advertiserForm.setData({
            name: selectedAdvertiser.name ?? '',
            company_name: selectedAdvertiser.company_name ?? '',
            document_type: selectedAdvertiser.document_type ?? '',
            document_number: selectedAdvertiser.document_number ?? '',
            contact_name: selectedAdvertiser.contact_name ?? '',
            contact_phone: selectedAdvertiser.contact_phone ?? '',
            contact_email: selectedAdvertiser.contact_email ?? '',
            notes: selectedAdvertiser.notes ?? '',
        });
    }, [selectedAdvertiser]);

    useEffect(() => {
        if (!selectedSlot) return void slotForm.reset();
        slotForm.setData({
            code: selectedSlot.code,
            name: selectedSlot.name,
            page_type: selectedSlot.page_type ?? '',
            size: selectedSlot.size ?? '',
            banner_width: String(selectedSlot.banner_width),
            banner_height: String(selectedSlot.banner_height),
            description: selectedSlot.description ?? '',
        });
    }, [selectedSlot]);

    useEffect(() => {
        if (!selectedCampaign) {
            campaignForm.reset();
            campaignForm.setData('status', 'draft');
            campaignForm.setData('priority_weight', 10);
            return;
        }

        campaignForm.setData({
            advertiser_id: String(selectedCampaign.advertiser_id),
            name: selectedCampaign.name,
            start_date: selectedCampaign.start_date ?? '',
            end_date: selectedCampaign.end_date ?? '',
            status: selectedCampaign.status ?? 'draft',
            priority_weight: selectedCampaign.priority_weight,
            notes: selectedCampaign.notes ?? '',
            slot_ids: selectedCampaign.slot_ids.map(String),
        });
    }, [selectedCampaign]);

    useEffect(() => {
        if (!selectedCreative) {
            creativeForm.reset();
            creativeForm.setData('display_weight', 1);
            setCreativePreview([]);
            setCreativeResetKey((current) => current + 1);
            return;
        }

        creativeForm.setData({
            campaign_id: String(selectedCreative.campaign_id),
            ad_slot_id: String(selectedCreative.ad_slot_id),
            title: selectedCreative.title ?? '',
            target_url: selectedCreative.target_url ?? '',
            alt_text: selectedCreative.alt_text ?? '',
            display_weight: selectedCreative.display_weight,
            creative_file: null,
        });
        setCreativePreview([selectedCreative.file_url]);
        setCreativeResetKey((current) => current + 1);
    }, [selectedCreative]);

    const sizeForSlot = useMemo(() => AD_SIZES.find((item) => item.value === slotForm.data.size) ?? null, [slotForm.data.size]);

    useEffect(() => {
        if (!sizeForSlot) return;
        slotForm.setData((current) => ({
            ...current,
            banner_width: String(sizeForSlot.width),
            banner_height: String(sizeForSlot.height),
        }));
    }, [sizeForSlot]);

    const advertiserOptions = advertisers.map((item) => ({ value: String(item.id), label: item.name }));
    const selectedCreativeCampaign = campaigns.find((item) => String(item.id) === creativeForm.data.campaign_id) ?? null;
    const creativeCampaignOptions = campaigns
        .filter((item) => item.status !== 'finished')
        .map((item) => ({ value: String(item.id), label: `${item.name} / ${item.advertiser?.name ?? 'Sin anunciante'}` }));
    const creativeSlotOptions = adSlots
        .filter((item) => selectedCreativeCampaign?.slot_ids.includes(item.id))
        .map((item) => ({ value: String(item.id), label: `${item.name} / ${item.banner_width}x${item.banner_height}` }));

    const advertiserPagination = useLocalPagination({ data: advertisers, limit: 8 });
    const slotPagination = useLocalPagination({ data: adSlots, limit: 8 });
    const campaignPagination = useLocalPagination({ data: campaigns, limit: 8 });
    const creativePagination = useLocalPagination({ data: creatives, limit: 8 });

    const submitAdvertiser = () => {
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                advertiserForm.reset();
                setSelectedAdvertiser(null);
            },
        };

        selectedAdvertiser
            ? advertiserForm.patch(route('advertisers.update', selectedAdvertiser.id), options)
            : advertiserForm.post(route('advertisers.store'), options);
    };

    const submitSlot = () => {
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                slotForm.reset();
                setSelectedSlot(null);
            },
        };

        selectedSlot ? slotForm.patch(route('ad-slots.update', selectedSlot.id), options) : slotForm.post(route('ad-slots.store'), options);
    };

    const submitCampaign = () => {
        const options = {
            preserveScroll: true,
            onSuccess: () => {
                campaignForm.reset();
                campaignForm.setData('status', 'draft');
                campaignForm.setData('priority_weight', 10);
                setSelectedCampaign(null);
            },
        };

        selectedCampaign ? campaignForm.patch(route('campaigns.update', selectedCampaign.id), options) : campaignForm.post(route('campaigns.store'), options);
    };

    const submitCreative = () => {
        const options = {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                creativeForm.reset();
                creativeForm.setData('display_weight', 1);
                setSelectedCreative(null);
                setCreativePreview([]);
                setCreativeResetKey((current) => current + 1);
            },
        };

        selectedCreative
            ? creativeForm.patch(route('ad-creatives.update', selectedCreative.id), options)
            : creativeForm.post(route('ad-creatives.store'), options);
    };

    const campaignLabel = (status: string | null) => CAMPAIGN_STATUSES.find((item) => item.value === status)?.label ?? 'Borrador';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Publicidad" />

            <div className="container-main space-y-6 py-4 text-xs sm:py-6">
                <SizeGuideCard />

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-4">
                        <AdvertiserFormCard form={advertiserForm} isEditing={selectedAdvertiser !== null} onSubmit={submitAdvertiser} onCancel={() => setSelectedAdvertiser(null)} />
                        <SlotFormCard form={slotForm} isEditing={selectedSlot !== null} onSubmit={submitSlot} onCancel={() => setSelectedSlot(null)} />
                    </div>

                    <div className="space-y-6 xl:col-span-8">
                        <CampaignFormCard form={campaignForm} advertiserOptions={advertiserOptions} adSlots={adSlots} isEditing={selectedCampaign !== null} onSubmit={submitCampaign} onCancel={() => setSelectedCampaign(null)} />
                        <CreativeFormCard
                            form={creativeForm}
                            campaignOptions={creativeCampaignOptions}
                            slotOptions={creativeSlotOptions}
                            isEditing={selectedCreative !== null}
                            hasSelectedCampaign={selectedCreativeCampaign !== null}
                            previewUrls={creativePreview}
                            resetKey={creativeResetKey}
                            onFilesUpload={(files, urls) => {
                                creativeForm.setData('creative_file', files[0] ?? null);
                                setCreativePreview(urls);
                            }}
                            onSubmit={submitCreative}
                            onCancel={() => setSelectedCreative(null)}
                            onCampaignChange={(value) => {
                                creativeForm.setData('campaign_id', value);
                                creativeForm.setData('ad_slot_id', '');
                            }}
                        />
                    </div>
                </section>

                <ControlSection
                    advertisersCount={advertisers.length}
                    adSlotsCount={adSlots.length}
                    campaignsCount={campaigns.length}
                    creativesCount={creatives.length}
                    advertisersTable={<AdvertisersTableCard advertisers={advertiserPagination.paginatedData} pagination={advertiserPagination.pagination} onPageChange={advertiserPagination.setPage} onEdit={setSelectedAdvertiser} />}
                    slotsTable={<SlotsTableCard adSlots={slotPagination.paginatedData} pagination={slotPagination.pagination} onPageChange={slotPagination.setPage} onEdit={setSelectedSlot} />}
                    campaignsTable={<CampaignsTableCard campaigns={campaignPagination.paginatedData} pagination={campaignPagination.pagination} onPageChange={campaignPagination.setPage} onEdit={setSelectedCampaign} campaignLabel={campaignLabel} />}
                    creativesTable={<CreativesTableCard creatives={creativePagination.paginatedData} pagination={creativePagination.pagination} onPageChange={creativePagination.setPage} onEdit={setSelectedCreative} />}
                />
            </div>
        </AppLayout>
    );
}
