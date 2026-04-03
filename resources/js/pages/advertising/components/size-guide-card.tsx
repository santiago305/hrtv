import { LayoutTemplate } from 'lucide-react';
import { AD_SIZES } from '../constants';
import { SectionCard } from './section-card';

export function SizeGuideCard() {
    return (
        <SectionCard
            icon={<LayoutTemplate className="h-5 w-5" />}
            title="Guia de banners"
            description="Estos son los 5 tamanos soportados por el sistema. Cada banner debe respetar exactamente estas medidas."
        >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                {AD_SIZES.map((size) => (
                    <div key={size.value} className="rounded-2xl border border-border bg-muted/20 p-4">
                        <div className="mb-2 text-sm font-semibold text-foreground">{size.label}</div>
                        <div className="text-xs text-muted-foreground">
                            {size.width} x {size.height} px
                        </div>
                        <div className="mt-3 rounded-xl border border-dashed border-border bg-background px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                            {size.value}
                        </div>
                    </div>
                ))}
            </div>
        </SectionCard>
    );
}
