import { Eye, EyeOff, GripVertical, Pin, RotateCcw, Settings2 } from 'lucide-react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { DataTableColumnManagerItem } from './types';

type Props = {
    columns: DataTableColumnManagerItem[];
    visibleColumnIds: string[];
    orderedColumnIds: string[];
    onToggle: (columnId: string) => void;
    onMove: (columnId: string, targetColumnId: string) => void;
    onReset: () => void;
};

type PanelPlacement = 'bottom' | 'top' | 'center';

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

export function DataTableColumnManager({
    columns,
    visibleColumnIds,
    orderedColumnIds,
    onToggle,
    onMove,
    onReset,
}: Props) {
    const [draggingColumnId, setDraggingColumnId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [placement, setPlacement] = useState<PanelPlacement>('bottom');
    const [panelStyle, setPanelStyle] = useState<CSSProperties | undefined>(undefined);
    const [isPositioned, setIsPositioned] = useState(false);
    const [dragOverColumnId, setDragOverColumnId] = useState<string | null>(null);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const panelRef = useRef<HTMLDivElement | null>(null);

    const orderedColumns = useMemo(() => {
        const map = new Map(columns.map((column) => [column.id, column]));
        return orderedColumnIds
            .map((id) => map.get(id))
            .filter(Boolean) as DataTableColumnManagerItem[];
    }, [columns, orderedColumnIds]);

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

    useEffect(() => {
        if (!open) {
            setIsPositioned(false);
            setPanelStyle(undefined);
            setPlacement('bottom');
        }
    }, [open]);

    useLayoutEffect(() => {
        if (!open) return;

        let frame1 = 0;
        let frame2 = 0;

        const updatePanelPosition = () => {
            const button = buttonRef.current;
            const panel = panelRef.current;

            if (!button || !panel) return;

            const gap = 12;
            const viewportPadding = 16;
            const preferredWidth = Math.min(360, window.innerWidth - viewportPadding * 2);

            const buttonRect = button.getBoundingClientRect();

            panel.style.width = `${preferredWidth}px`;
            panel.style.maxWidth = `${preferredWidth}px`;

            const panelRect = panel.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const viewportWidth = window.innerWidth;

            const panelHeight = panelRect.height;
            const panelWidth = panelRect.width;

            const spaceBelow = viewportHeight - buttonRect.bottom - viewportPadding;
            const spaceAbove = buttonRect.top - viewportPadding;

            const fitsBelow = panelHeight + gap <= spaceBelow;
            const fitsAbove = panelHeight + gap <= spaceAbove;

            let nextPlacement: PanelPlacement = 'bottom';
            let top = buttonRect.bottom + gap;

            if (fitsBelow) {
                nextPlacement = 'bottom';
                top = buttonRect.bottom + gap;
            } else if (fitsAbove) {
                nextPlacement = 'top';
                top = Math.max(viewportPadding, buttonRect.top - panelHeight - gap);
            } else {
                nextPlacement = 'center';
                const availableHeight = viewportHeight - viewportPadding * 2;
                top = Math.max(
                    viewportPadding,
                    Math.round((viewportHeight - Math.min(panelHeight, availableHeight)) / 2),
                );
            }

            let left = buttonRect.right - panelWidth;
            left = Math.max(
                viewportPadding,
                Math.min(left, viewportWidth - panelWidth - viewportPadding),
            );

            const availableHeight =
                nextPlacement === 'bottom'
                    ? Math.max(220, spaceBelow - gap)
                    : nextPlacement === 'top'
                      ? Math.max(220, spaceAbove - gap)
                      : viewportHeight - viewportPadding * 2;

            setPlacement(nextPlacement);
            setPanelStyle({
                position: 'fixed',
                top,
                left,
                width: preferredWidth,
                maxWidth: preferredWidth,
                maxHeight: availableHeight,
                zIndex: 999,
            });
            setIsPositioned(true);
        };

        setIsPositioned(false);

        frame1 = window.requestAnimationFrame(() => {
            frame2 = window.requestAnimationFrame(updatePanelPosition);
        });

        const handleViewportChange = () => {
            setIsPositioned(false);
            window.requestAnimationFrame(() => {
                window.requestAnimationFrame(updatePanelPosition);
            });
        };

        window.addEventListener('resize', handleViewportChange);
        window.addEventListener('scroll', handleViewportChange, true);

        return () => {
            window.cancelAnimationFrame(frame1);
            window.cancelAnimationFrame(frame2);
            window.removeEventListener('resize', handleViewportChange);
            window.removeEventListener('scroll', handleViewportChange, true);
        };
    }, [open, orderedColumns.length]);

    return (
        <div ref={containerRef} className="relative z-80 inline-block">
            <button
                ref={buttonRef}
                type="button"
                aria-expanded={open}
                aria-haspopup="dialog"
                onClick={() => setOpen((current) => !current)}
                className={cn(
                    'inline-flex h-11 items-center gap-2 rounded-2xl border px-4 text-sm font-medium shadow-sm transition',
                    open
                        ? 'border-primary/30 bg-primary/5 text-foreground'
                        : 'border-border/70 bg-background text-foreground hover:bg-muted/50',
                )}
            >
                <Settings2 className="h-4 w-4" />
                Configurar tabla
            </button>

            {open && (
                <div
                    ref={panelRef}
                    role="dialog"
                    aria-label="Configuracion de tabla"
                    style={panelStyle}
                    className={cn(
                        'overflow-hidden rounded-3xl border border-border/70 bg-background/95 p-3 shadow-2xl backdrop-blur-xl transition-[opacity,transform]',
                        isPositioned
                            ? 'opacity-100 translate-y-0 scale-100'
                            : 'pointer-events-none opacity-0 scale-[0.98]',
                        placement === 'top' && isPositioned && 'translate-y-0',
                        placement === 'bottom' && isPositioned && 'translate-y-0',
                        placement === 'center' && isPositioned && 'translate-y-0',
                    )}
                >
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-foreground">
                                Columnas
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Activa, oculta y ordena arrastrando.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={onReset}
                            className="inline-flex items-center gap-1 rounded-xl px-2.5 py-2 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        >
                            <RotateCcw className="h-3.5 w-3.5" />
                            Restablecer
                        </button>
                    </div>

                    <div
                        className="space-y-2 overflow-y-auto pr-1"
                        style={{
                            maxHeight:
                                typeof panelStyle?.maxHeight === 'number'
                                    ? Math.max(panelStyle.maxHeight - 88, 140)
                                    : undefined,
                        }}
                    >
                        {orderedColumns.map((column) => {
                            const checked = visibleColumnIds.includes(column.id);
                            const isPinned = !!column.pinned;
                            const isLocked = column.lockPosition === true;
                            const canDrag = !isLocked;

                            return (
                                <div
                                    key={column.id}
                                    draggable={canDrag}
                                    onDragStart={() => canDrag && setDraggingColumnId(column.id)}
                                    onDragOver={(event) => {
                                        if (!canDrag) return;
                                        event.preventDefault();
                                        setDragOverColumnId(column.id);
                                    }}
                                    onDragLeave={() => {
                                        if (dragOverColumnId === column.id) {
                                            setDragOverColumnId(null);
                                        }
                                    }}
                                    onDrop={() => {
                                        if (!draggingColumnId || draggingColumnId === column.id) {
                                            setDragOverColumnId(null);
                                            return;
                                        }

                                        onMove(draggingColumnId, column.id);
                                        setDraggingColumnId(null);
                                        setDragOverColumnId(null);
                                    }}
                                    onDragEnd={() => {
                                        setDraggingColumnId(null);
                                        setDragOverColumnId(null);
                                    }}
                                    className={cn(
                                        'flex items-center gap-3 rounded-2xl border px-3 py-3 transition',
                                        'border-border/60 bg-background',
                                        draggingColumnId === column.id && 'scale-[0.99] opacity-60',
                                        dragOverColumnId === column.id && 'border-primary/40 bg-primary/5',
                                        canDrag && 'cursor-grab active:cursor-grabbing hover:border-border hover:bg-muted/30',
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'flex h-9 w-9 items-center justify-center rounded-xl',
                                            canDrag ? 'text-muted-foreground' : 'text-muted-foreground/40',
                                        )}
                                    >
                                        <GripVertical className="h-4 w-4" />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            column.hideable !== false && onToggle(column.id)
                                        }
                                        disabled={column.hideable === false}
                                        className={cn(
                                            'inline-flex h-9 w-9 items-center justify-center rounded-xl border transition',
                                            checked
                                                ? 'border-primary/25 bg-primary/10 text-primary'
                                                : 'border-border/70 text-muted-foreground hover:bg-muted',
                                            column.hideable === false &&
                                                'cursor-not-allowed opacity-70',
                                        )}
                                        title={checked ? 'Ocultar columna' : 'Mostrar columna'}
                                    >
                                        {checked ? (
                                            <Eye className="h-4 w-4" />
                                        ) : (
                                            <EyeOff className="h-4 w-4" />
                                        )}
                                    </button>

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium text-foreground">
                                            {column.header}
                                        </p>

                                        <div className="mt-1.5 flex flex-wrap gap-1.5">
                                            {column.hideable === false ? (
                                                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                    Fija visible
                                                </span>
                                            ) : null}

                                            {isPinned ? (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                    <Pin className="h-3 w-3" />
                                                    Pin {column.pinned}
                                                </span>
                                            ) : null}

                                            {isLocked ? (
                                                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                                    Posición bloqueada
                                                </span>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}