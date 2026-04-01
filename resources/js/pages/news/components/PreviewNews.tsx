import { useNewsForm } from '@/hooks/news-form';
import CarouselBlog from './CarouselBlog';
import DescriptionBlog from './DescriptionBlog';
import TitleBlog from './TitleBlog';
import VideoBlog from './VideoBlog';

export default function PreviewNews() {
    const { preview } = useNewsForm();

    return (
        <div className="min-w-75 h-full flex-1 select-none">
            <div className="relative flex h-full flex-col overflow-y-auto rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                <TitleBlog title={preview.title} />

                {preview.imagePreviews.length > 0 ? (
                    <div className="p-4">
                        <CarouselBlog images={preview.imagePreviews} />
                    </div>
                ) : null}

                <DescriptionBlog description={preview.excerpt} />

                {preview.videoPreviews.length > 0 ? (
                    <div className="p-4">
                        <VideoBlog video={preview.videoPreviews} />
                    </div>
                ) : null}
            </div>
        </div>
    );
}
