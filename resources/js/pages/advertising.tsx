import { ActionsPopover } from '@/components/ActionsPopover';
import { FloatingInput } from '@/components/FloatingInput';
import { FloatingSelect } from '@/components/FloatingSelect';
import { FloatingTextarea } from '@/components/FloatingTextarea';
import InputImages from '@/components/input_images/input-images';
import { useLocalPagination } from '@/components/pagination/use-local-pagination';
import { DataTable } from '@/components/table/DataTable';
import type { DataTableColumn } from '@/components/table/types';
import { SystemButton } from '@/components/SystemButton';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem, SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { BarChart3, ImagePlus, LayoutTemplate, Megaphone, PenLine, SlidersVertical, SquareChartGantt } from 'lucide-react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Publicidad', href: '/dashboard/ads' },
];

const AD_SIZES = [
    { value: 'banner', label: 'Banner', width: 728, height: 90 },
    { value: 'square', label: 'Square', width: 300, height: 250 },
    { value: 'leaderboard', label: 'Leaderboard', width: 970, height: 90 },
    { value: 'skyscraper', label: 'Skyscraper', width: 160, height: 600 },
    { value: 'rectangle', label: 'Rectangle', width: 336, height: 280 },
] as const;

const PAGE_TYPES = [
    { value: 'home', label: 'Inicio' },
    { value: 'radio', label: 'Radio' },
    { value: 'about', label: 'Conocenos' },
    { value: 'contact', label: 'Contacto' },
    { value: 'news_list', label: 'Listado de noticias' },
    { value: 'news_detail', label: 'Detalle de noticia' },
];

const CAMPAIGN_STATUSES = [
    { value: 'draft', label: 'Borrador' },
    { value: 'active', label: 'Activa' },
    { value: 'paused', label: 'Pausada' },
    { value: 'finished', label: 'Finalizada' },
];

type AdvertiserItem = {
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

type AdSlotItem = {
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

type CampaignItem = {
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

type CreativeItem = {
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

type AdvertisingPageProps = SharedData & {
    advertisers: AdvertiserItem[];
    adSlots: AdSlotItem[];
    campaigns: CampaignItem[];
    creatives: CreativeItem[];
};

type AdvertiserFormData = {
    name: string;
    company_name: string;
    document_type: string;
    document_number: string;
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    notes: string;
};

type SlotFormData = {
    code: string;
    name: string;
    page_type: string;
    size: string;
    banner_width: string;
    banner_height: string;
    description: string;
};

type CampaignFormData = {
    advertiser_id: string;
    name: string;
    start_date: string;
    end_date: string;
    status: string;
    priority_weight: number;
    notes: string;
    slot_ids: string[];
};

type CreativeFormData = {
    campaign_id: string;
    ad_slot_id: string;
    title: string;
    target_url: string;
    alt_text: string;
    display_weight: number;
    creative_file: File | null;
};

function activeBadge(active: boolean) {
    return active
        ? 'inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
        : 'inline-flex rounded-full bg-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-500/15 dark:text-slate-300';
}

function campaignBadge(status: string | null) {
    if (status === 'active') return 'inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300';
    if (status === 'paused') return 'inline-flex rounded-full bg-amber-100 px-3 py-1 text-[11px] font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300';
    if (status === 'finished') return 'inline-flex rounded-full bg-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-500/15 dark:text-slate-300';
    return 'inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary';
}

function campaignLabel(status: string | null) {
    return CAMPAIGN_STATUSES.find((item) => item.value === status)?.label ?? 'Borrador';
}

function formatCtr(clicks: number, impressions: number) {
    if (impressions <= 0) return '0%';
    return `${((clicks / impressions) * 100).toFixed(2)}%`;
}

function formatBytes(size: number | null) {
    if (!size) return 'Sin dato';
    if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${size} B`;
}

function SectionCard({ icon, title, description, children }: { icon: ReactNode; title: string; description: string; children: ReactNode }) {
    return (
        <div className="rounded-sm border border-border bg-background p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3 border-b border-border pb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">{icon}</div>
                <div>
                    <h2 className="text-base font-semibold text-foreground">{title}</h2>
                    <p className="text-xs text-muted-foreground">{description}</p>
                </div>
            </div>
            {children}
        </div>
    );
}

function PrioritySlider({ value, onChange, disabled }: { value: number; onChange: (value: number) => void; disabled?: boolean }) {
    return (
        <div className="rounded-xl border border-border bg-muted/20 p-4">
            <div className="mb-3 flex items-center justify-between">
                <div>
                    <div className="text-sm font-semibold text-foreground">Prioridad</div>
                    <div className="text-xs text-muted-foreground">Mayor peso = mas apariciones</div>
                </div>
                <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{value}</div>
            </div>
            <div className="flex items-center justify-center py-6">
                <input type="range" min={1} max={100} step={1} value={value} disabled={disabled} onChange={(event) => onChange(Number(event.target.value))} className="h-3 w-40 -rotate-90 cursor-pointer accent-primary" />
            </div>
            <div className="flex justify-between text-[11px] text-muted-foreground">
                <span>1</span>
                <span>50</span>
                <span>100</span>
            </div>
        </div>
    );
}

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
        slotForm.setData((current) => ({ ...current, banner_width: String(sizeForSlot.width), banner_height: String(sizeForSlot.height) }));
    }, [sizeForSlot]);

    const advertiserOptions = advertisers.map((item) => ({ value: String(item.id), label: item.name }));
    const selectedCreativeCampaign = campaigns.find((item) => String(item.id) === creativeForm.data.campaign_id) ?? null;
    const creativeCampaignOptions = campaigns.filter((item) => item.status !== 'finished').map((item) => ({ value: String(item.id), label: `${item.name} / ${item.advertiser?.name ?? 'Sin anunciante'}` }));
    const creativeSlotOptions = adSlots.filter((item) => selectedCreativeCampaign?.slot_ids.includes(item.id)).map((item) => ({ value: String(item.id), label: `${item.name} / ${item.banner_width}x${item.banner_height}` }));

    const advertiserPagination = useLocalPagination({ data: advertisers, limit: 8 });
    const slotPagination = useLocalPagination({ data: adSlots, limit: 8 });
    const campaignPagination = useLocalPagination({ data: campaigns, limit: 8 });
    const creativePagination = useLocalPagination({ data: creatives, limit: 8 });

    const submitAdvertiser = () => {
        const options = { preserveScroll: true, onSuccess: () => { advertiserForm.reset(); setSelectedAdvertiser(null); } };
        selectedAdvertiser ? advertiserForm.patch(route('advertisers.update', selectedAdvertiser.id), options) : advertiserForm.post(route('advertisers.store'), options);
    };

    const submitSlot = () => {
        const options = { preserveScroll: true, onSuccess: () => { slotForm.reset(); setSelectedSlot(null); } };
        selectedSlot ? slotForm.patch(route('ad-slots.update', selectedSlot.id), options) : slotForm.post(route('ad-slots.store'), options);
    };

    const submitCampaign = () => {
        const options = { preserveScroll: true, onSuccess: () => { campaignForm.reset(); campaignForm.setData('status', 'draft'); campaignForm.setData('priority_weight', 10); setSelectedCampaign(null); } };
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

        selectedCreative ? creativeForm.patch(route('ad-creatives.update', selectedCreative.id), options) : creativeForm.post(route('ad-creatives.store'), options);
    };

    const advertiserColumns: DataTableColumn<AdvertiserItem>[] = [
        { id: 'name', header: 'Anunciante', accessorKey: 'name', hideable: false, className: 'font-medium text-foreground' },
        { id: 'company_name', header: 'Empresa', cell: (item) => <span className="text-muted-foreground">{item.company_name || 'Persona natural'}</span> },
        { id: 'contact', header: 'Contacto', cell: (item) => <div><div>{item.contact_name || item.name}</div><div className="text-[11px] text-muted-foreground">{item.contact_email || 'Sin correo'}</div></div> },
        { id: 'campaigns_count', header: 'Campanas', accessorKey: 'campaigns_count', className: 'text-center', headerClassName: 'text-center' },
        { id: 'status', header: 'Estado', cell: (item) => <span className={activeBadge(item.is_active)}>{item.is_active ? 'Activo' : 'Inactivo'}</span> },
        {
            id: 'actions',
            header: 'Acciones',
            sortable: false,
            searchable: false,
            hideable: false,
            className: 'flex justify-center',
            cell: (item) => <ActionsPopover actions={[
                { id: 'edit', label: 'Editar', icon: <PenLine className="h-4 w-4" />, onClick: () => setSelectedAdvertiser(item) },
                { id: 'toggle', label: item.is_active ? 'Desactivar' : 'Activar', icon: <Megaphone className="h-4 w-4" />, onClick: () => router.patch(route('advertisers.toggle-status', item.id), {}, { preserveScroll: true, preserveState: true }) },
            ]} columns={1} compact triggerVariant="outline" />,
        },
    ];

    const slotColumns: DataTableColumn<AdSlotItem>[] = [
        { id: 'name', header: 'Slot', accessorKey: 'name', hideable: false, className: 'font-medium text-foreground' },
        { id: 'code', header: 'Codigo', accessorKey: 'code', cell: (item) => <span className="font-mono text-[11px] text-muted-foreground">{item.code}</span> },
        { id: 'location', header: 'Ubicacion', cell: (item) => <div><div>{PAGE_TYPES.find((page) => page.value === item.page_type)?.label ?? item.page_type}</div><div className="text-[11px] text-muted-foreground">{item.size} / {item.banner_width}x{item.banner_height}</div></div> },
        { id: 'creatives_count', header: 'Creativos', accessorKey: 'creatives_count', className: 'text-center', headerClassName: 'text-center' },
        { id: 'status', header: 'Estado', cell: (item) => <span className={activeBadge(item.is_active)}>{item.is_active ? 'Activo' : 'Inactivo'}</span> },
        {
            id: 'actions',
            header: 'Acciones',
            sortable: false,
            searchable: false,
            hideable: false,
            className: 'flex justify-center',
            cell: (item) => <ActionsPopover actions={[
                { id: 'edit', label: 'Editar', icon: <PenLine className="h-4 w-4" />, onClick: () => setSelectedSlot(item) },
                { id: 'toggle', label: item.is_active ? 'Desactivar' : 'Activar', icon: <LayoutTemplate className="h-4 w-4" />, onClick: () => router.patch(route('ad-slots.toggle-status', item.id), {}, { preserveScroll: true, preserveState: true }) },
            ]} columns={1} compact triggerVariant="outline" />,
        },
    ];

    const campaignColumns: DataTableColumn<CampaignItem>[] = [
        { id: 'name', header: 'Campana', accessorKey: 'name', hideable: false, className: 'font-medium text-foreground' },
        { id: 'advertiser', header: 'Anunciante', cell: (item) => <span className="text-muted-foreground">{item.advertiser?.name ?? 'Sin anunciante'}</span> },
        { id: 'dates', header: 'Vigencia', cell: (item) => <div><div>{item.start_date || 'Sin inicio'}</div><div className="text-[11px] text-muted-foreground">hasta {item.end_date || 'Sin fin'}</div></div> },
        { id: 'priority', header: 'Prioridad', accessorKey: 'priority_weight', className: 'text-center', headerClassName: 'text-center' },
        { id: 'metrics', header: 'Metricas', cell: (item) => <div><div>{item.impressions_count} impresiones</div><div className="text-[11px] text-muted-foreground">{item.clicks_count} clicks / CTR {formatCtr(item.clicks_count, item.impressions_count)}</div></div> },
        { id: 'status', header: 'Estado', cell: (item) => <span className={campaignBadge(item.status)}>{campaignLabel(item.status)}</span> },
        {
            id: 'actions',
            header: 'Acciones',
            sortable: false,
            searchable: false,
            hideable: false,
            className: 'flex justify-center',
            cell: (item) => <ActionsPopover actions={[
                { id: 'edit', label: 'Editar', icon: <PenLine className="h-4 w-4" />, onClick: () => setSelectedCampaign(item) },
                { id: 'toggle', label: item.status === 'active' ? 'Pausar' : 'Activar', icon: <SlidersVertical className="h-4 w-4" />, onClick: () => router.patch(route('campaigns.toggle-status', item.id), {}, { preserveScroll: true, preserveState: true }) },
            ]} columns={1} compact triggerVariant="outline" />,
        },
    ];

    const creativeColumns: DataTableColumn<CreativeItem>[] = [
        { id: 'banner', header: 'Banner', hideable: false, cell: (item) => <div className="flex items-center gap-3"><img src={item.file_url} alt={item.alt_text ?? item.title ?? 'banner'} className="h-10 w-16 rounded-lg border border-border object-cover" /><div><div>{item.title || 'Sin titulo'}</div><div className="text-[11px] text-muted-foreground">{item.width}x{item.height}</div></div></div> },
        { id: 'campaign', header: 'Campana', cell: (item) => <div><div>{item.campaign?.name ?? 'Sin campana'}</div><div className="text-[11px] text-muted-foreground">{item.campaign?.advertiser?.name ?? 'Sin anunciante'}</div></div> },
        { id: 'slot', header: 'Slot', cell: (item) => <div><div>{item.slot?.name ?? 'Sin slot'}</div><div className="text-[11px] text-muted-foreground">{item.slot?.size} / {item.slot?.banner_width}x{item.slot?.banner_height}</div></div> },
        { id: 'weight', header: 'Peso', accessorKey: 'display_weight', className: 'text-center', headerClassName: 'text-center' },
        { id: 'metrics', header: 'Metricas', cell: (item) => <div><div>{item.impressions_count} impresiones / {item.clicks_count} clicks</div><div className="text-[11px] text-muted-foreground">CTR {formatCtr(item.clicks_count, item.impressions_count)} / {formatBytes(item.file_size)}</div></div> },
        { id: 'status', header: 'Estado', cell: (item) => <span className={activeBadge(item.is_active)}>{item.is_active ? 'Activo' : 'Inactivo'}</span> },
        {
            id: 'actions',
            header: 'Acciones',
            sortable: false,
            searchable: false,
            hideable: false,
            className: 'flex justify-center',
            cell: (item) => <ActionsPopover actions={[
                { id: 'edit', label: 'Editar', icon: <PenLine className="h-4 w-4" />, onClick: () => setSelectedCreative(item) },
                { id: 'toggle', label: item.is_active ? 'Desactivar' : 'Activar', icon: <ImagePlus className="h-4 w-4" />, onClick: () => router.patch(route('ad-creatives.toggle-status', item.id), {}, { preserveScroll: true, preserveState: true }) },
            ]} columns={1} compact triggerVariant="outline" />,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Publicidad" />

            <div className="container-main space-y-6 py-4 text-xs sm:py-6">
                <SectionCard icon={<LayoutTemplate className="h-5 w-5" />} title="Guia de banners" description="Estos son los 5 tamanos soportados por el sistema. Cada banner debe respetar exactamente estas medidas.">
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                        {AD_SIZES.map((size) => (
                            <div key={size.value} className="rounded-2xl border border-border bg-muted/20 p-4">
                                <div className="mb-2 text-sm font-semibold text-foreground">{size.label}</div>
                                <div className="text-xs text-muted-foreground">{size.width} x {size.height} px</div>
                                <div className="mt-3 rounded-xl border border-dashed border-border bg-background px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{size.value}</div>
                            </div>
                        ))}
                    </div>
                </SectionCard>

                <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                    <div className="space-y-6 xl:col-span-4">
                        <SectionCard icon={<Megaphone className="h-5 w-5" />} title={selectedAdvertiser ? 'Editar anunciante' : 'Crear anunciante'} description="Registra la empresa o persona que contratara publicidad.">
                            <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); submitAdvertiser(); }}>
                                <FloatingInput label="Nombre comercial" name="name" value={advertiserForm.data.name} onChange={(event) => advertiserForm.setData('name', event.target.value)} error={advertiserForm.errors.name} />
                                <FloatingInput label="Empresa" name="company_name" value={advertiserForm.data.company_name} onChange={(event) => advertiserForm.setData('company_name', event.target.value)} error={advertiserForm.errors.company_name} />
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <FloatingInput label="Tipo documento" name="document_type" value={advertiserForm.data.document_type} onChange={(event) => advertiserForm.setData('document_type', event.target.value)} error={advertiserForm.errors.document_type} />
                                    <FloatingInput label="Numero documento" name="document_number" value={advertiserForm.data.document_number} onChange={(event) => advertiserForm.setData('document_number', event.target.value)} error={advertiserForm.errors.document_number} />
                                </div>
                                <FloatingInput label="Nombre de contacto" name="contact_name" value={advertiserForm.data.contact_name} onChange={(event) => advertiserForm.setData('contact_name', event.target.value)} error={advertiserForm.errors.contact_name} />
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <FloatingInput label="Telefono" name="contact_phone" value={advertiserForm.data.contact_phone} onChange={(event) => advertiserForm.setData('contact_phone', event.target.value)} error={advertiserForm.errors.contact_phone} />
                                    <FloatingInput label="Correo" name="contact_email" type="email" value={advertiserForm.data.contact_email} onChange={(event) => advertiserForm.setData('contact_email', event.target.value)} error={advertiserForm.errors.contact_email} />
                                </div>
                                <FloatingTextarea label="Notas" name="notes" value={advertiserForm.data.notes} onChange={(event) => advertiserForm.setData('notes', event.target.value)} error={advertiserForm.errors.notes} rows={4} className="min-h-24" />
                                <div className="flex gap-3">
                                    <SystemButton type="submit" size="sm" fullWidth loading={advertiserForm.processing}>{selectedAdvertiser ? 'Guardar anunciante' : 'Crear anunciante'}</SystemButton>
                                    {selectedAdvertiser ? <SystemButton type="button" variant="outline" size="sm" fullWidth onClick={() => setSelectedAdvertiser(null)}>Cancelar</SystemButton> : null}
                                </div>
                            </form>
                        </SectionCard>

                        <SectionCard icon={<SquareChartGantt className="h-5 w-5" />} title={selectedSlot ? 'Editar slot publicitario' : 'Crear slot publicitario'} description="Define el espacio exacto donde puede mostrarse publicidad.">
                            <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); submitSlot(); }}>
                                <FloatingInput label="Codigo unico" name="code" value={slotForm.data.code} onChange={(event) => slotForm.setData('code', event.target.value)} error={slotForm.errors.code} />
                                <FloatingInput label="Nombre del slot" name="slot_name" value={slotForm.data.name} onChange={(event) => slotForm.setData('name', event.target.value)} error={slotForm.errors.name} />
                                <FloatingSelect label="Pagina" name="page_type" value={slotForm.data.page_type} options={PAGE_TYPES} onChange={(value) => slotForm.setData('page_type', value)} error={slotForm.errors.page_type} placeholder="" />
                                <FloatingSelect label="Tamano" name="size" value={slotForm.data.size} options={AD_SIZES.map((size) => ({ value: size.value, label: `${size.label} (${size.width}x${size.height})` }))} onChange={(value) => slotForm.setData('size', value)} error={slotForm.errors.size} placeholder="" />
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    <FloatingInput label="Ancho" name="banner_width" type="number" value={slotForm.data.banner_width} onChange={(event) => slotForm.setData('banner_width', event.target.value)} error={slotForm.errors.banner_width} />
                                    <FloatingInput label="Alto" name="banner_height" type="number" value={slotForm.data.banner_height} onChange={(event) => slotForm.setData('banner_height', event.target.value)} error={slotForm.errors.banner_height} />
                                </div>
                                <FloatingTextarea label="Descripcion" name="description" value={slotForm.data.description} onChange={(event) => slotForm.setData('description', event.target.value)} error={slotForm.errors.description} rows={4} className="min-h-24" />
                                <div className="flex gap-3">
                                    <SystemButton type="submit" size="sm" fullWidth loading={slotForm.processing}>{selectedSlot ? 'Guardar slot' : 'Crear slot'}</SystemButton>
                                    {selectedSlot ? <SystemButton type="button" variant="outline" size="sm" fullWidth onClick={() => setSelectedSlot(null)}>Cancelar</SystemButton> : null}
                                </div>
                            </form>
                        </SectionCard>
                    </div>

                    <div className="space-y-6 xl:col-span-8">
                        <SectionCard icon={<SlidersVertical className="h-5 w-5" />} title={selectedCampaign ? 'Editar campana' : 'Crear campana'} description="Asigna anunciante, vigencia, slots y prioridad de salida.">
                            <form className="grid grid-cols-1 gap-6 xl:grid-cols-[1.3fr_220px]" onSubmit={(event) => { event.preventDefault(); submitCampaign(); }}>
                                <div className="space-y-4">
                                    <FloatingSelect label="Anunciante" name="advertiser_id" value={campaignForm.data.advertiser_id} options={advertiserOptions} onChange={(value) => campaignForm.setData('advertiser_id', value)} error={campaignForm.errors.advertiser_id} placeholder="" searchable />
                                    <FloatingInput label="Nombre de campana" name="campaign_name" value={campaignForm.data.name} onChange={(event) => campaignForm.setData('name', event.target.value)} error={campaignForm.errors.name} />
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                        <FloatingInput label="Fecha inicio" name="start_date" type="date" value={campaignForm.data.start_date} onChange={(event) => campaignForm.setData('start_date', event.target.value)} error={campaignForm.errors.start_date} />
                                        <FloatingInput label="Fecha fin" name="end_date" type="date" value={campaignForm.data.end_date} onChange={(event) => campaignForm.setData('end_date', event.target.value)} error={campaignForm.errors.end_date} />
                                    </div>
                                    <FloatingSelect label="Estado" name="status" value={campaignForm.data.status} options={CAMPAIGN_STATUSES} onChange={(value) => campaignForm.setData('status', value)} error={campaignForm.errors.status} placeholder="" />
                                    <div className="rounded-xl border border-border bg-muted/20 p-4">
                                        <div className="mb-3 text-sm font-semibold text-foreground">Slots disponibles</div>
                                        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                                            {adSlots.length === 0 ? <span className="text-xs text-muted-foreground">Primero crea slots publicitarios.</span> : adSlots.map((slot) => {
                                                const checked = campaignForm.data.slot_ids.includes(String(slot.id));
                                                return (
                                                    <label key={slot.id} className="flex items-start gap-3 rounded-xl border border-border bg-background px-3 py-3 text-xs">
                                                        <input type="checkbox" checked={checked} onChange={(event) => campaignForm.setData('slot_ids', event.target.checked ? [...campaignForm.data.slot_ids, String(slot.id)] : campaignForm.data.slot_ids.filter((id) => id !== String(slot.id)))} className="mt-0.5 h-4 w-4" />
                                                        <div>
                                                            <div className="font-medium text-foreground">{slot.name}</div>
                                                            <div className="text-[11px] text-muted-foreground">{slot.code} / {slot.page_type} / {slot.banner_width}x{slot.banner_height}</div>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        {campaignForm.errors.slot_ids ? <p className="mt-2 text-xs text-red-600 dark:text-red-400">{campaignForm.errors.slot_ids}</p> : null}
                                    </div>
                                    <FloatingTextarea label="Notas" name="campaign_notes" value={campaignForm.data.notes} onChange={(event) => campaignForm.setData('notes', event.target.value)} error={campaignForm.errors.notes} rows={4} className="min-h-24" />
                                    <div className="flex gap-3">
                                        <SystemButton type="submit" size="sm" fullWidth loading={campaignForm.processing}>{selectedCampaign ? 'Guardar campana' : 'Crear campana'}</SystemButton>
                                        {selectedCampaign ? <SystemButton type="button" variant="outline" size="sm" fullWidth onClick={() => setSelectedCampaign(null)}>Cancelar</SystemButton> : null}
                                    </div>
                                </div>
                                <PrioritySlider value={campaignForm.data.priority_weight} onChange={(value) => campaignForm.setData('priority_weight', value)} disabled={campaignForm.processing} />
                            </form>
                        </SectionCard>

                        <SectionCard icon={<ImagePlus className="h-5 w-5" />} title={selectedCreative ? 'Editar banner creativo' : 'Subir banner creativo'} description="Carga una imagen por banner. La URL de destino es opcional.">
                            <form className="space-y-4" onSubmit={(event) => { event.preventDefault(); submitCreative(); }}>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FloatingSelect label="Campana" name="campaign_id" value={creativeForm.data.campaign_id} options={creativeCampaignOptions} onChange={(value) => { creativeForm.setData('campaign_id', value); creativeForm.setData('ad_slot_id', ''); }} error={creativeForm.errors.campaign_id} placeholder="" searchable />
                                    <FloatingSelect label="Slot" name="ad_slot_id" value={creativeForm.data.ad_slot_id} options={creativeSlotOptions} onChange={(value) => creativeForm.setData('ad_slot_id', value)} error={creativeForm.errors.ad_slot_id} placeholder="" searchable disabled={!selectedCreativeCampaign} />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FloatingInput label="Titulo" name="creative_title" value={creativeForm.data.title} onChange={(event) => creativeForm.setData('title', event.target.value)} error={creativeForm.errors.title} />
                                    <FloatingInput label="URL destino opcional" name="target_url" value={creativeForm.data.target_url} onChange={(event) => creativeForm.setData('target_url', event.target.value)} error={creativeForm.errors.target_url} />
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FloatingInput label="Texto alternativo" name="alt_text" value={creativeForm.data.alt_text} onChange={(event) => creativeForm.setData('alt_text', event.target.value)} error={creativeForm.errors.alt_text} />
                                    <FloatingInput label="Peso interno" name="display_weight" type="number" min={1} max={100} value={creativeForm.data.display_weight} onChange={(event) => creativeForm.setData('display_weight', Number(event.target.value || 1))} error={creativeForm.errors.display_weight} />
                                </div>
                                <InputImages id="creative-upload" label={selectedCreative ? 'Reemplazar imagen del banner' : 'Subir imagen del banner'} accept="image/*" error={creativeForm.errors.creative_file ?? null} previewUrls={creativePreview} onFilesUpload={(files, urls) => { creativeForm.setData('creative_file', files[0] ?? null); setCreativePreview(urls); }} resetKey={creativeResetKey} helperText="Usa exactamente el tamano del slot elegido. Puedes dejar la URL vacia si no debe redirigir." />
                                <div className="flex gap-3">
                                    <SystemButton type="submit" size="sm" fullWidth loading={creativeForm.processing}>{selectedCreative ? 'Guardar banner' : 'Crear banner'}</SystemButton>
                                    {selectedCreative ? <SystemButton type="button" variant="outline" size="sm" fullWidth onClick={() => setSelectedCreative(null)}>Cancelar</SystemButton> : null}
                                </div>
                            </form>
                        </SectionCard>
                    </div>
                </section>

                <SectionCard icon={<BarChart3 className="h-5 w-5" />} title="Control y seguimiento" description="Desde aqui puedes editar, activar o pausar cada entidad de publicidad.">
                    <div className="space-y-6">
                        <div>
                            <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">Anunciantes</h3><span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">{advertisers.length} registros</span></div>
                            <DataTable data={advertiserPagination.paginatedData} columns={advertiserColumns} tableId="ads-advertisers-table" rowKey={(item) => String(item.id)} showSearch searchPlaceholder="Buscar anunciantes..." striped animated={false} selectableColumns={false} emptyMessage="No hay anunciantes creados." pagination={advertiserPagination.pagination} onPageChange={advertiserPagination.setPage} />
                        </div>
                        <div>
                            <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">Slots publicitarios</h3><span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">{adSlots.length} registros</span></div>
                            <DataTable data={slotPagination.paginatedData} columns={slotColumns} tableId="ads-slots-table" rowKey={(item) => String(item.id)} showSearch searchPlaceholder="Buscar slots..." striped animated={false} selectableColumns={false} emptyMessage="No hay slots creados." pagination={slotPagination.pagination} onPageChange={slotPagination.setPage} />
                        </div>
                        <div>
                            <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">Campanas</h3><span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">{campaigns.length} registros</span></div>
                            <DataTable data={campaignPagination.paginatedData} columns={campaignColumns} tableId="ads-campaigns-table" rowKey={(item) => String(item.id)} showSearch searchPlaceholder="Buscar campanas..." striped animated={false} selectableColumns={false} emptyMessage="No hay campanas creadas." pagination={campaignPagination.pagination} onPageChange={campaignPagination.setPage} />
                        </div>
                        <div>
                            <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">Banners creativos</h3><span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">{creatives.length} registros</span></div>
                            <DataTable data={creativePagination.paginatedData} columns={creativeColumns} tableId="ads-creatives-table" rowKey={(item) => String(item.id)} showSearch searchPlaceholder="Buscar banners..." striped animated={false} selectableColumns={false} emptyMessage="No hay banners cargados." pagination={creativePagination.pagination} onPageChange={creativePagination.setPage} />
                        </div>
                    </div>
                </SectionCard>
            </div>
        </AppLayout>
    );
}
