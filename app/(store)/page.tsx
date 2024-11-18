import BlackFridayBanner from '@/components/BlackFridayBanner';
import ProductsView from '@/components/ProductsView';
import { sanityFetch } from '@/sanity/lib/live';
import { ALL_CATEGORIES_QUERY, ALL_PRODUCTS_QUERY } from '@/sanity/queries';

export const dynamic = 'force-static';
export const revalidate = 60;

export default async function Home() {
  const [products, categories] = await Promise.all([
    sanityFetch({ query: ALL_PRODUCTS_QUERY }),
    sanityFetch({ query: ALL_CATEGORIES_QUERY }),
  ]);
  // console.log(products);

  return (
    <div>
      <BlackFridayBanner />
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4">
        <ProductsView products={products.data} categories={categories.data} />
      </div>
    </div>
  );
}
