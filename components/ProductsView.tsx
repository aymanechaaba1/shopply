import React from 'react';
import ProductGrid from './ProductGrid';
import { Category, Product } from '@/sanity/types';
import { CategorySelector } from './CategorySelector';

function ProductsView({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  return (
    <div className="flex flex-col">
      {/* categories */}
      <div className="w-full sm:w-[200px]"></div>
      <CategorySelector categories={categories} />
      {/* products */}
      <div className="flex-1">
        <div>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}

export default ProductsView;
