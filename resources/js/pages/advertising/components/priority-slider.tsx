import * as React from 'react';
import * as Slider from '@radix-ui/react-slider';

type PrioritySliderProps = {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
};

type Orientation = 'vertical' | 'horizontal';

function cn(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ');
}

const MARKS = [0, 25, 50, 75, 100];

export function PrioritySlider({
    value,
    onChange,
    disabled = false,
    min = 0,
    max = 100,
    step = 1,
    className,
}: PrioritySliderProps) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [orientation, setOrientation] = React.useState<Orientation>('vertical');

    React.useEffect(() => {
        const element = containerRef.current;
        if (!element) return;

        const updateOrientation = () => {
            const { width, height } = element.getBoundingClientRect();
            setOrientation(height >= width ? 'vertical' : 'horizontal');
        };

        updateOrientation();

        const observer = new ResizeObserver(updateOrientation);
        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    const isVertical = orientation === 'vertical';

    return (
        <div
            ref={containerRef}
            className={cn(
                'rounded-2xl border border-border bg-muted/20 p-4',
                'flex min-h-[240px] w-full flex-col overflow-hidden',
                className
            )}
        >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">Prioridad</span>
            </div>

            {/* Content */}
            <div
                className={cn(
                    'flex-1',
                    isVertical
                        ? 'grid grid-cols-[1fr_auto] items-stretch justify-items-center gap-5'
                        : 'grid grid-rows-[auto_auto] gap-3'
                )}
            >
                {/* Slider */}
                <div
                    className={cn(
                        'relative min-h-0 min-w-0',
                        isVertical
                            ? 'flex h-full w-full items-center justify-center'
                            : 'flex h-full w-full items-center'
                    )}
                >
                    <Slider.Root
                        value={[value]}
                        min={min}
                        max={max}
                        step={step}
                        disabled={disabled}
                        orientation={orientation}
                        onValueChange={(values) => onChange(values[0] ?? min)}
                        aria-label="Prioridad"
                        className={cn(
                            'relative flex touch-none select-none items-center data-[disabled]:opacity-50',
                            isVertical
                                ? 'h-full min-h-42.5 w-8 justify-center py-1'
                                : 'h-8 w-full px-1'
                        )}
                    >
                        <Slider.Track
                            className={cn(
                                'relative overflow-hidden rounded-full bg-muted',
                                isVertical ? 'h-full w-1.5' : 'h-1.5 w-full'
                            )}
                        >
                            <Slider.Range
                                className={cn(
                                    'absolute rounded-full bg-primary',
                                    isVertical ? 'bottom-0 w-full' : 'left-0 h-full'
                                )}
                            />
                        </Slider.Track>

                        <Slider.Thumb
                            className="block h-5 w-5 rounded-full border-[3px] border-background bg-primary shadow-sm outline-none transition-transform hover:scale-105 focus-visible:ring-4 focus-visible:ring-primary/20"
                        />
                    </Slider.Root>
                </div>

                {/* Marks */}
                {isVertical ? (
                    <div className="relative h-full min-h-[170px] w-10">
                        {MARKS.map((mark) => {
                            const percent = (mark - min) / (max - min);
                            const isMin = mark === min;
                            const isMax = mark === max;

                            return (
                                <div
                                    key={mark}
                                    className={cn(
                                        'absolute left-0 text-[11px] text-muted-foreground',
                                        !isMin && !isMax && '-translate-y-1/2'
                                    )}
                                    style={{
                                        bottom: `${percent * 100}%`,
                                    }}
                                >
                                    {mark}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="relative h-4 w-full">
                        {MARKS.map((mark) => {
                            const percent = (mark - min) / (max - min);

                            return (
                                <div
                                    key={mark}
                                    className="absolute top-0 -translate-x-1/2 text-[11px] text-muted-foreground"
                                    style={{
                                        left: `${percent * 100}%`,
                                    }}
                                >
                                    {mark}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}       