import ProductsView from '@/components/ProductsView';
import { sanityFetch } from '@/sanity/lib/live';
import {
  ALL_CATEGORIES_QUERY,
  PRODUCTS_BY_CATEGORY_QUERY,
} from '@/sanity/queries';
import React from 'react';

async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [products, categories] = await Promise.all([
    sanityFetch({
      query: PRODUCTS_BY_CATEGORY_QUERY,
      params: {
        categorySlug: slug,
      },
    }),
    sanityFetch({ query: ALL_CATEGORIES_QUERY }),
  ]);
  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          {slug
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join('')}{' '}
          Collection
        </h1>
        <ProductsView products={products.data} categories={categories.data} />
      </div>
    </div>
  );
}

export default CategoryPage;
