type TitleNewsProps = {
    title?: string;
};

export default function TitleNews({ title }: TitleNewsProps) {
    return (
        <h1 className="text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            {title}
        </h1>
    );
}
