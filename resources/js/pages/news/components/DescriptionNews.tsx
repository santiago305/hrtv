type DescriptionNewsProps = {
    description?: string;
    className?: string;
};

export default function DescriptionNews({ description, className }: DescriptionNewsProps) {
    if (!description || description.trim().length === 0) {
        return null;
    }

    return (
        <div className={['whitespace-pre-line text-sm leading-[1.8] text-foreground/85', className].filter(Boolean).join(' ')}>
            {description}
        </div>
    );
}
