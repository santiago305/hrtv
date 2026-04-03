import { BarChart3 } from 'lucide-react';
import { SectionCard } from './section-card';

type ControlSectionProps = {
    advertisersCount: number;
    adSlotsCount: number;
    campaignsCount: number;
    creativesCount: number;
    advertisersTable: React.ReactNode;
    slotsTable: React.ReactNode;
    campaignsTable: React.ReactNode;
    creativesTable: React.ReactNode;
};

export function ControlSection({
    advertisersCount,
    adSlotsCount,
    campaignsCount,
    creativesCount,
    advertisersTable,
    slotsTable,
    campaignsTable,
    creativesTable,
}: ControlSectionProps) {
    return (
        <SectionCard
            icon={<BarChart3 className="h-5 w-5" />}
            title="Control y seguimiento"
            description="Desde aqui puedes editar, activar o pausar cada entidad de publicidad."
        >
            <div className="space-y-6">
                <div>
                    <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">Anunciantes</h3><span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">{advertisersCount} registros</span></div>
                    {advertisersTable}
                </div>
                <div>
                    <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">Slots publicitarios</h3><span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">{adSlotsCount} registros</span></div>
                    {slotsTable}
                </div>
                <div>
                    <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">Campanas</h3><span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">{campaignsCount} registros</span></div>
                    {campaignsTable}
                </div>
                <div>
                    <div className="mb-4 flex items-center justify-between"><h3 className="text-sm font-semibold text-foreground">Banners creativos</h3><span className="rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">{creativesCount} registros</span></div>
                    {creativesTable}
                </div>
            </div>
        </SectionCard>
    );
}
