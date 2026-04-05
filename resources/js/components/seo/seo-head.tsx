import { Head } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';

type SeoType = 'website' | 'article' | 'video.other';

type SeoHeadProps = PropsWithChildren<{
    title: string;
    description: string;
    path?: string;
    image?: string | null;
    type?: SeoType;
    robots?: string;
    keywords?: string[];
    author?: string;
    publishedTime?: string | null;
    section?: string;
    siteName?: string;
    videoUrl?: string | null;
    jsonLd?: Record<string, unknown> | null;
}>;

const DEFAULT_SITE_NAME = 'HRTV';
const DEFAULT_ROBOTS = 'index, follow';
const DEFAULT_IMAGE = '/storage/logo.png';

function absoluteUrl(value?: string | null): string | undefined {
    if (!value) {
        return undefined;
    }

    if (value.startsWith('http://') || value.startsWith('https://')) {
        return value;
    }

    if (typeof window === 'undefined') {
        return value;
    }

    return new URL(value, window.location.origin).toString();
}

export function SeoHead({
    title,
    description,
    path,
    image,
    type = 'website',
    robots = DEFAULT_ROBOTS,
    keywords = [],
    author,
    publishedTime,
    section,
    siteName = DEFAULT_SITE_NAME,
    videoUrl,
    jsonLd,
}: SeoHeadProps) {
    const canonicalUrl = absoluteUrl(path ?? (typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/'));
    const imageUrl = absoluteUrl(image ?? DEFAULT_IMAGE);
    const ogVideoUrl = absoluteUrl(videoUrl ?? undefined);

    return (
        <Head title={title}>
            <meta head-key="description" name="description" content={description} />
            <meta head-key="robots" name="robots" content={robots} />
            <meta head-key="viewport" name="viewport" content="width=device-width, initial-scale=1.0" />
            {keywords.length > 0 ? <meta head-key="keywords" name="keywords" content={keywords.join(', ')} /> : null}
            {canonicalUrl ? <link head-key="canonical" rel="canonical" href={canonicalUrl} /> : null}

            <meta head-key="og:title" property="og:title" content={title} />
            <meta head-key="og:description" property="og:description" content={description} />
            <meta head-key="og:type" property="og:type" content={type} />
            <meta head-key="og:site_name" property="og:site_name" content={siteName} />
            {canonicalUrl ? <meta head-key="og:url" property="og:url" content={canonicalUrl} /> : null}
            {imageUrl ? <meta head-key="og:image" property="og:image" content={imageUrl} /> : null}
            {ogVideoUrl ? <meta head-key="og:video" property="og:video" content={ogVideoUrl} /> : null}

            <meta head-key="twitter:card" name="twitter:card" content="summary_large_image" />
            <meta head-key="twitter:title" name="twitter:title" content={title} />
            <meta head-key="twitter:description" name="twitter:description" content={description} />
            {imageUrl ? <meta head-key="twitter:image" name="twitter:image" content={imageUrl} /> : null}

            {author ? <meta head-key="article:author" property="article:author" content={author} /> : null}
            {publishedTime ? <meta head-key="article:published_time" property="article:published_time" content={publishedTime} /> : null}
            {section ? <meta head-key="article:section" property="article:section" content={section} /> : null}

            <link head-key="favicon" rel="icon" href="/favicon.ico" />
            {jsonLd ? (
                <script
                    head-key="json-ld"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            ) : null}
        </Head>
    );
}
