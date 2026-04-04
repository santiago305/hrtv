import { Modal } from '@/components/modales/Modal';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { cn } from '@/lib/utils';
import { Activity, BarChart3, Eye, Heart, LoaderCircle, Radio, Tag, UserRound } from 'lucide-react';
import { type ReactNode, useEffect, useState } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { NewsTableItem } from '../types';

type EngagementRange = '7d' | '30d' | '1y';

type NewsDetailModalProps = {
    open: boolean;
    item: NewsTableItem | null;
    onClose: () => void;
};

type EngagementPayload = NewsTableItem['engagement'];

const RANGE_LABELS: Record<EngagementRange, string> = {
    '7d': '7 dias',
    '30d': '30 dias',
    '1y': '1 ano',
};

function formatLongDate(value: string | null) {
    if (!value) return 'Sin fecha';

    return new Date(value).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
}

function formatChartDate(value: string, range: EngagementRange) {
    return new Date(`${value}T00:00:00`).toLocaleDateString('es-ES',
        range === '1y'
            ? {
                  month: 'short',
                  year: '2-digit',
              }
            : {
                  day: '2-digit',
                  month: 'short',
              },
    );
}

function formatCompactNumber(value: number) {
    return new Intl.NumberFormat('es-ES').format(value);
}

function MetricCard({
    label,
    value,
    helper,
    icon,
}: {
    label: string;
    value: string;
    helper: string;
    icon: ReactNode;
}) {
    return (
        <div className="border border-border bg-background p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                    <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{helper}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-muted/40 text-primary">{icon}</div>
            </div>
        </div>
    );
}

function DetailBlock({
    label,
    value,
    icon,
}: {
    label: string;
    value: string;
    icon: ReactNode;
}) {
    return (
        <div className="border-l-2 border-primary pl-4">
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {icon}
                {label}
            </p>
            <p className="mt-2 text-sm leading-6 text-foreground">{value}</p>
        </div>
    );
}

export function NewsDetailModal({ open, item, onClose }: NewsDetailModalProps) {
    const [range, setRange] = useState<EngagementRange>('30d');
    const [engagement, setEngagement] = useState<EngagementPayload | null>(item?.engagement ?? null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!item || !open) {
            return;
        }

        if (range === '30d') {
            setEngagement(item.engagement);
            return;
        }

        const controller = new AbortController();

        const loadEngagement = async () => {
            setLoading(true);

            try {
                const response = await fetch(`${route('dashboard.news.engagement', item.id)}?range=${range}`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                    },
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error('No se pudo cargar el engagement');
                }

                const data = (await response.json()) as { engagement: EngagementPayload };
                setEngagement(data.engagement);
            } catch (error) {
                if (controller.signal.aborted) {
                    return;
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        void loadEngagement();

        return () => controller.abort();
    }, [item, open, range]);

    useEffect(() => {
        if (!item) {
            setRange('30d');
            setEngagement(null);
            setLoading(false);
            return;
        }

        setRange('30d');
        setEngagement(item.engagement);
        setLoading(false);
    }, [item]);

    const activeEngagement = engagement ?? item?.engagement ?? null;
    const activeRange = (activeEngagement?.range ?? range) as EngagementRange;
    const chartData =
        activeEngagement?.daily.map((stat) => ({
            ...stat,
            label: formatChartDate(stat.date, activeRange),
        })) ?? [];

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={item ? item.title : 'Detalle de noticia'}
            description="Resumen tecnico de rendimiento editorial y engagement."
            className="w-full max-w-5xl"
            bodyClassName="space-y-6 px-5 py-5"
            overlayBlur
        >
            {item ? (
                <>
                    <div className="grid gap-4 lg:grid-cols-[1.25fr_0.95fr]">
                        <div className="space-y-4 border border-border bg-muted/15 p-5">
                            <p className="text-xs leading-7 text-foreground/80">
                                Esta vista resume solo datos tecnicos. No expone cuerpo, bajada, portada ni archivos multimedia.
                            </p>

                            <div className="grid gap-5 sm:grid-cols-2">
                                <DetailBlock label="Escritor" value={item.author?.name ?? 'Sin autor'} icon={<UserRound className="h-3.5 w-3.5" />} />
                                <DetailBlock label="Categoria" value={item.category?.name ?? 'Sin categoria'} icon={<Tag className="h-3.5 w-3.5" />} />
                                <DetailBlock label="Subcategoria" value={item.sub_category?.name ?? 'Sin subcategoria'} icon={<Tag className="h-3.5 w-3.5" />} />
                                <DetailBlock
                                    label="Estado"
                                    value={item.is_published ? 'Activa y visible al publico' : 'Desactivada en publicacion'}
                                    icon={<Radio className="h-3.5 w-3.5" />}
                                />
                                <DetailBlock label="Publicacion" value={formatLongDate(item.published_at)} icon={<Activity className="h-3.5 w-3.5" />} />
                                <DetailBlock
                                    label="Destacado"
                                    value={item.is_featured ? 'Si, marcada como destacada' : 'No destacada'}
                                    icon={<BarChart3 className="h-3.5 w-3.5" />}
                                />
                            </div>
                        </div>

                        <div className="grid gap-4">
                            <MetricCard
                                label="Vistas Totales"
                                value={formatCompactNumber(item.views_count)}
                                helper={`${formatCompactNumber(activeEngagement?.period_totals.views_count ?? 0)} en ${RANGE_LABELS[activeRange]}`}
                                icon={<Eye className="h-5 w-5" />}
                            />
                            <MetricCard
                                label="Me Gusta Totales"
                                value={formatCompactNumber(item.likes_count)}
                                helper={`${formatCompactNumber(activeEngagement?.period_totals.likes_count ?? 0)} en ${RANGE_LABELS[activeRange]}`}
                                icon={<Heart className="h-5 w-5" />}
                            />
                        </div>
                    </div>

                    <div className="border border-border bg-background p-5">
                        <div className="mb-5 flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h3 className="text-base font-semibold text-foreground">Comportamiento diario</h3>
                                <p className="text-xs text-muted-foreground">Consulta por filtro: 7 dias, 30 dias o 1 ano. La modal pide los datos al backend segun el rango.</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                                {loading ? <LoaderCircle className="h-4 w-4 animate-spin text-muted-foreground" /> : null}
                                <ToggleGroup
                                    type="single"
                                    value={range}
                                    onValueChange={(value) => {
                                        if (value === '7d' || value === '30d' || value === '1y') {
                                            setRange(value);
                                        }
                                    }}
                                    variant="outline"
                                    className="rounded-none border border-border bg-muted/20 p-1"
                                >
                                    <ToggleGroupItem value="7d" className="rounded-none px-3 text-xs">7 dias</ToggleGroupItem>
                                    <ToggleGroupItem value="30d" className="rounded-none px-3 text-xs">30 dias</ToggleGroupItem>
                                    <ToggleGroupItem value="1y" className="rounded-none px-3 text-xs">1 ano</ToggleGroupItem>
                                </ToggleGroup>
                            </div>
                        </div>

                        {chartData.length > 0 ? (
                            <div className="h-80 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 12, right: 8, left: -16, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="newsViewsFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0f766e" stopOpacity={0.35} />
                                                <stop offset="95%" stopColor="#0f766e" stopOpacity={0.04} />
                                            </linearGradient>
                                            <linearGradient id="newsLikesFill" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#b45309" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#b45309" stopOpacity={0.03} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border/60" />
                                        <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={activeRange === '1y' ? 28 : 18} tick={{ fontSize: 11, fill: 'currentColor' }} className="text-muted-foreground" />
                                        <YAxis tickLine={false} axisLine={false} width={40} tick={{ fontSize: 11, fill: 'currentColor' }} className="text-muted-foreground" />
                                        <Tooltip
                                            cursor={{ stroke: '#94a3b8', strokeDasharray: '4 4' }}
                                            contentStyle={{
                                                borderRadius: 0,
                                                border: '1px solid var(--border)',
                                                background: 'var(--background)',
                                                fontSize: '12px',
                                            }}
                                            labelFormatter={(_, payload) => {
                                                const rawDate = payload?.[0]?.payload?.date;
                                                return rawDate ? formatLongDate(rawDate) : '';
                                            }}
                                        />
                                        <Area type="monotone" dataKey="views_count" name="Vistas" stroke="#0f766e" fill="url(#newsViewsFill)" strokeWidth={2.25} />
                                        <Area type="monotone" dataKey="likes_count" name="Me gusta" stroke="#b45309" fill="url(#newsLikesFill)" strokeWidth={2.25} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className={cn('flex min-h-56 items-center justify-center border border-dashed border-border bg-muted/15 px-6 text-center text-sm text-muted-foreground')}>
                                Aun no hay interacciones registradas para el rango seleccionado.
                            </div>
                        )}
                    </div>
                </>
            ) : null}
        </Modal>
    );
}
