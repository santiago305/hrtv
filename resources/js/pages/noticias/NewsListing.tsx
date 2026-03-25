import { router, usePage } from '@inertiajs/react';
import { AdPlaceholder } from '@/components/AdPlaceholder';
import { NewsCard } from '@/components/NewsCard';
import { categories, mockArticles } from '@/data/mockData';
import PublicSiteLayout from '@/layouts/public-site-layout';

export default function NewsListingPage() {
  const { url } = usePage();
  const searchParams = new URLSearchParams(url.split('?')[1] ?? '');
  const activeCategory = searchParams.get('categoria') || '';
  const activeSubcategory = searchParams.get('subcategoria') || '';

  const selectedCategory = categories.find((c) => c.slug === activeCategory);

  const filteredArticles = mockArticles.filter((a) => {
    if (activeSubcategory) return a.subcategory?.slug === activeSubcategory;
    if (activeCategory) return a.category.slug === activeCategory;
    return true;
  });

  const updateFilters = (params: Record<string, string>) => {
    router.get(route('news.index'), params, {
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
            {filteredArticles.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2">
                {filteredArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
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
                        {mockArticles.filter((a) => a.category.slug === cat.slug).length}
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
