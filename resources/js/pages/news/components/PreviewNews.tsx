import { useNewsForm } from '@/hooks/news-form';
import CarouselNews from './CarouselNews';
import DescriptionNews from './DescriptionNews';
import ExcerptNews from './ExcerptNews';
import TitleNews from './TitleNews';
import VideoNews from './VideoNews';

export default function PreviewNews() {
    const { preview } = useNewsForm();

    return (
        <div className="min-w-75 h-full flex-1 select-none">
            <div className="relative flex h-full flex-col overflow-y-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border  p-3">
                <TitleNews title={preview.title} />

                {preview.imagePreviews.length > 0 ? (
                    <div className="p-4">
                        <CarouselNews images={preview.imagePreviews} />
                    </div>
                ) : null}

                <ExcerptNews excerpt={preview.excerpt} />
                <DescriptionNews description={preview.content} />

                {preview.videoPreviews.length > 0 ? (
                    <div className="p-4">
                        <VideoNews video={preview.videoPreviews} />
                    </div>
                ) : null}
            </div>
        </div>
    );
}
