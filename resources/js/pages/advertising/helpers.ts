export function activeBadge(active: boolean) {
    return active
        ? 'inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
        : 'inline-flex rounded-full bg-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-500/15 dark:text-slate-300';
}

export function campaignBadge(status: string | null) {
    if (status === 'active') return 'inline-flex rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300';
    if (status === 'paused') return 'inline-flex rounded-full bg-amber-100 px-3 py-1 text-[11px] font-medium text-amber-700 dark:bg-amber-500/15 dark:text-amber-300';
    if (status === 'finished') return 'inline-flex rounded-full bg-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-500/15 dark:text-slate-300';
    return 'inline-flex rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary';
}

export function formatCtr(clicks: number, impressions: number) {
    if (impressions <= 0) return '0%';
    return `${((clicks / impressions) * 100).toFixed(2)}%`;
}

export function formatBytes(size: number | null) {
    if (!size) return 'Sin dato';
    if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`;
    if (size >= 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${size} B`;
}
