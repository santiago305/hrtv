type ExcerptNewsProps = {
    excerpt?: string;
};

export default function ExcerptNews({ excerpt }: ExcerptNewsProps) {
    if (!excerpt) {
        return null;
    }

    return <p className="mt-5 border-l-2 border-primary pl-4 text-base leading-relaxed text-foreground/70">{excerpt}</p>;
}
