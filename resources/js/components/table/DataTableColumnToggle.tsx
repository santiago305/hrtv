import { Settings2 } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

type ToggleColumnItem = {
    id: string;
    header: string;
    hideable?: boolean;
};

type Props = {
    columns: ToggleColumnItem[];
    visibleColumnIds: string[];
    onToggle: (columnId: string) => void;
    onReset: () => void;
};

export function DataTableColumnToggle({ columns, visibleColumnIds, onToggle, onReset }: Props) {
    const hideableColumns = useMemo(() => columns.filter((column) => column.hideable !== false), [columns]);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!open) return;

        const handlePointerDown = (event: MouseEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [open]);

    if (hideableColumns.length === 0) {
        return null;
    }

    return (
        <div ref={containerRef} className="relative inline-block">
            <button
                type="button"
                aria-expanded={open}
                aria-haspopup="dialog"
                onClick={() => setOpen((current) => !current)}
                className="inline-flex cursor-pointer select-none items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm transition hover:bg-muted/50"
            >
                <Settings2 className="h-4 w-4" />
                Columnas
            </button>

            {open && (
                <div
                    role="dialog"
                    aria-label="Selector de columnas"
                    className="absolute right-0 z-20 mt-2 w-64 rounded-2xl border border-border bg-background p-3 shadow-xl"
                >
                    <div className="mb-3 flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">Mostrar columnas</span>

                        <button
                            type="button"
                            onClick={onReset}
                            className="text-xs text-muted-foreground transition hover:text-foreground"
                        >
                            Restablecer
                        </button>
                    </div>

                    <div className="space-y-2">
                        {hideableColumns.map((column) => {
                            const checked = visibleColumnIds.includes(column.id);

                            return (
                                <label
                                    key={column.id}
                                    className="flex cursor-pointer items-center justify-between rounded-xl px-2 py-2 transition hover:bg-muted/50"
                                >
                                    <span className="text-sm text-foreground">{column.header}</span>

                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => onToggle(column.id)}
                                        className="h-4 w-4 rounded border-border"
                                    />
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
