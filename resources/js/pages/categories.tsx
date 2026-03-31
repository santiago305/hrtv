import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { CategoryFormCard } from './categories/components/category-form-card';
import { CategoriesTableCard } from './categories/components/categories-table-card';
import { SubCategoriesTableCard } from './categories/components/sub-categories-table-card';
import { SubCategoryFormCard } from './categories/components/sub-category-form-card';
import type { CategoriesPageProps, CategoryFormData, SubCategoryFormData } from './categories/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Categorias',
        href: '/dashboard/categories',
    },
];

export default function CategoriesIndex() {
    const { categories, subCategories } = usePage<CategoriesPageProps>().props;

    const categoryOptions = categories.map((category) => ({
        id: category.id,
        name: category.name,
    }));

    const categoryForm = useForm<CategoryFormData>({
        name: '',
        description: '',
    });

    const subCategoryForm = useForm<SubCategoryFormData>({
        category_id: '',
        name: '',
        description: '',
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categorias" />

            <div className="container-main py-4 text-xs sm:py-6">
                <div className="flex flex-col gap-6">

                    <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
                        <div className="space-y-6 xl:col-span-4 2xl:col-span-3">
                            <CategoryFormCard
                                data={categoryForm.data}
                                errors={categoryForm.errors}
                                processing={categoryForm.processing}
                                onChange={categoryForm.setData}
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    categoryForm.post(route('categories.store'), {
                                        preserveScroll: true,
                                        errorBag: 'createCategory',
                                        onSuccess: () => categoryForm.reset(),
                                    });
                                }}
                            />

                            <SubCategoryFormCard
                                data={subCategoryForm.data}
                                categoryOptions={categoryOptions}
                                errors={subCategoryForm.errors}
                                processing={subCategoryForm.processing}
                                onChange={subCategoryForm.setData}
                                onSubmit={(event) => {
                                    event.preventDefault();
                                    subCategoryForm.post(route('sub-categories.store'), {
                                        preserveScroll: true,
                                        errorBag: 'createSubCategory',
                                        onSuccess: () => subCategoryForm.reset('category_id', 'name', 'description'),
                                    });
                                }}
                            />
                        </div>

                        <div className="space-y-6 xl:col-span-8 2xl:col-span-9">
                            <CategoriesTableCard categories={categories} />
                            <SubCategoriesTableCard subCategories={subCategories} categoryOptions={categoryOptions} />
                        </div>
                    </section>
                </div>
            </div>
        </AppLayout>
    );
}
