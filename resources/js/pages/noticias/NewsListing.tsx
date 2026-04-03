import { router, usePage } from '@inertiajs/react';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { NewsCard } from '@/components/NewsCard';
import { Pagination } from '@/components/pagination/Pagination';
import PublicSiteLayout from '@/layouts/public-site-layout';
import type { NewsArticle, NewsCategory } from '@/types/news';
import type { DataTablePaginationMeta } from '@/components/table/types';

type NewsListingPageProps = {
  categories: NewsCategory[];
  articles: NewsArticle[];
  pagination: DataTablePaginationMeta;
  activeCategory: string;
  activeSubcategory: string;
};

export default function NewsListingPage() {
  const { props } = usePage<NewsListingPageProps>();
  const categories = props.categories ?? [];
  const articles = props.articles ?? [];
  const pagination = props.pagination;
  const activeCategory = props.activeCategory ?? '';
  const activeSubcategory = props.activeSubcategory ?? '';

  const selectedCategory = categories.find((c) => c.slug === activeCategory);

  const buildRoute = (page: number, params: Record<string, string> = {}) => {
    const query = new URLSearchParams(params).toString();
    const path = page <= 1 ? route('news.index') : route('news.index', { page });

    return query.length > 0 ? `${path}?${query}` : path;
  };

  const updateFilters = (params: Record<string, string>) => {
    router.get(buildRoute(1, params), {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const handleCategoryClick = (slug: string) => {
    if (slug === activeCategory) {
      updateFilters({});
      return;
    }

    updateFilters({ categoria: slug });
  };

  const handleSubcategoryClick = (slug: string) => {
    if (slug === activeSubcategory) {
      updateFilters(activeCategory ? { categoria: activeCategory } : {});
      return;
    }

    const params: Record<string, string> = { subcategoria: slug };
    if (activeCategory) params.categoria = activeCategory;
    updateFilters(params);
  };

  const handlePageChange = (page: number) => {
    const params: Record<string, string> = {};
    if (activeCategory) params.categoria = activeCategory;
    if (activeSubcategory) params.subcategoria = activeSubcategory;

    router.get(buildRoute(page, params), {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  return (
    <PublicSiteLayout title="Noticias">
      <div className="container-main py-8">
        <div className="mb-6 overflow-x-auto">
          <div className="flex items-center gap-1 pb-2">
            <button
              type="button"
              onClick={() => updateFilters({})}
              className={`shrink-0 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                !activeCategory
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              Todas
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.slug)}
                className={`shrink-0 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                  activeCategory === cat.slug
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {selectedCategory?.subcategories && selectedCategory.subcategories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-1">
            {selectedCategory.subcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => handleSubcategoryClick(sub.slug)}
                className={`px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-colors ${
                  activeSubcategory === sub.slug
                    ? 'bg-foreground text-background'
                    : 'border border-border text-muted-foreground hover:text-foreground'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        <AdPlaceholder size="leaderboard" className="mb-8" />

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {articles.length > 0 ? (
              <>
                <div className="grid gap-5 sm:grid-cols-2">
                  {articles.map((article) => (
                    <NewsCard key={article.id} article={article} />
                  ))}
                </div>

                {pagination.total > pagination.limit ? (
                  <div className="mt-8 flex justify-center">
                    <div className="w-full max-w-3xl flex justify-center">
                      <Pagination
                        page={pagination.page}
                        limit={pagination.limit}
                        total={pagination.total}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="flex h-40 items-center justify-center border border-dashed border-border">
                <p className="text-sm text-muted-foreground">No se encontraron noticias en esta categoria.</p>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <AdPlaceholder size="rectangle" className="mx-auto" />

            <div className="border border-border p-4">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Categorias
              </h3>
              <ul className="space-y-2">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => handleCategoryClick(cat.slug)}
                      className={`flex w-full items-center justify-between text-sm transition-colors ${
                        activeCategory === cat.slug ? 'font-semibold text-primary' : 'text-foreground hover:text-primary'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {cat.newsCount ?? 0}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <AdPlaceholder size="rectangle" className="mx-auto" />
          </aside>
        </div>
      </div>
    </PublicSiteLayout>
  );
}
