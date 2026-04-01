type DescriptionNewsProps = {
    description?: string;
};

export default function DescriptionNews({ description }: DescriptionNewsProps) {
    return <p className="m-4 whitespace-pre-line text-base md:text-lg">{description}</p>;
}
