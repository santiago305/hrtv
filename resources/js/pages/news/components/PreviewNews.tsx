import { usePage } from '@inertiajs/react';
import type { SharedData } from '@/types';
import { useNewsForm } from '@/hooks/news-form';
import AudioNews from './AudioNews';
import CarouselNews from './CarouselNews';
import DescriptionNews from './DescriptionNews';
import ExcerptNews from './ExcerptNews';
import NewsMeta from './NewsMeta';
import TitleNews from './TitleNews';
import VideoNews from './VideoNews';

export default function PreviewNews() {
    const { preview, form } = useNewsForm();
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-w-75 h-full flex-1 select-none">
            <div className="relative flex h-full flex-col overflow-y-auto rounded-xl border border-sidebar-border/70 p-5 dark:border-sidebar-border">
                <TitleNews title={preview.title} />
                <NewsMeta
                    authorName={auth.user?.name}
                    publishedAt={form.data.published_at || new Date().toISOString()}
                    viewsCount={Number(form.data.views_count || '0')}
                />

                {preview.imagePreviews.length > 0 ? <CarouselNews images={preview.imagePreviews} /> : null}

                <ExcerptNews excerpt={preview.excerpt} />

                <div className="mt-6">
                    <AudioNews src={preview.audioPreview} />
                    <DescriptionNews description={preview.content} />
                    <div className="clear-both" />
                </div>

                {preview.videoPreviews.length > 0 ? <VideoNews video={preview.videoPreviews} /> : null}
            </div>
        </div>
    );
}
