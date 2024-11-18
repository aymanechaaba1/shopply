import AddToBasketButton from '@/components/AddToBasketButton';
import { imageUrl } from '@/lib/imageUrl';
import { cn } from '@/lib/utils';
import { client } from '@/sanity/lib/client';
import { PRODUCT_BY_SLUG_QUERY } from '@/sanity/queries';
import { PortableText } from 'next-sanity';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import React from 'react';

export const dynamic = 'force-static';
export const revalidate = 60;

async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  let { slug } = await params;
  let product = await client.fetch(PRODUCT_BY_SLUG_QUERY, {
    slug,
  });
  if (!product) return notFound();

  let isOutOfStock = product.stock != null && product.stock <= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div
          className={cn(
            'relative aspect-square overflow-hidden rounded-lg shadow-lg',
            {
              isOutOfStock: 'opacity-50',
            }
          )}
        >
          {product.image && (
            <Image
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              src={imageUrl(product.image).url()}
              alt={product.name || 'Product Image'}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <div className="text-xl font-semibold mb-4">
              {' '}
              {new Intl.NumberFormat('en-US', {
                currency: 'USD',
                style: 'currency',
              }).format(product.price || 0)}
            </div>
            <div className="prose max-w-none mb-6">
              {Array.isArray(product.description) && (
                <PortableText value={product.description} />
              )}
            </div>
          </div>
          <div className="mt-6">
            <AddToBasketButton product={product} disabled={isOutOfStock} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
