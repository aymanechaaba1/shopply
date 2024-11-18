import ProductGrid from '@/components/ProductGrid';
import { sanityFetch } from '@/sanity/lib/live';
import { PRODUCTS_SEARCH_QUERY } from '@/sanity/queries';
import React from 'react';

async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ query: string }>;
}) {
  let { query } = await searchParams;
  let products = await sanityFetch({
    query: PRODUCTS_SEARCH_QUERY,
    params: { searchParam: query },
  });

  if (!products.data.length)
    return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-6 text-center">
            No products found for: {query}
          </h1>
          <p className="text-gray-600 text-center">
            Try searching with different keywords
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Search results for {query}
        </h1>
        <ProductGrid products={products.data} />
      </div>
    </div>
  );
}

export default SearchPage;
