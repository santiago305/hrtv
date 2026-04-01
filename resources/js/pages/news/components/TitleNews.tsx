type TitleNewsProps = {
    title?: string;
};

export default function TitleNews({ title }: TitleNewsProps) {
    return (
        <h3 className="m-4 text-3xl font-bold text-red-700 md:text-5xl lg:text-7xl">
            <strong>{title}</strong>
        </h3>
    );
}
