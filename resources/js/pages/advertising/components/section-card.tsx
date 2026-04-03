import type { ReactNode } from 'react';

type SectionCardProps = {
    icon: ReactNode;
    title: string;
    description: string;
    children: ReactNode;
};

export function SectionCard({ icon, title, description, children }: SectionCardProps) {
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
