import { imageUrl } from '@/lib/imageUrl';
import { Product } from '@/sanity/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function ProductThumbnail({ product }: { product: Product }) {
  let isOutOfStock = product.stock != null && product.stock <= 0;
  console.log(isOutOfStock);

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className={`group flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden p-4 ${isOutOfStock ? 'opacity-50' : ''}`}
    >
      <div className="relative aspect-square w-full h-full overflow-hidden">
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
      <h1 className="text-2xl">{product.name}</h1>
      <p className="my-2 text-sm text-gray-600 line-clamp-1">
        {product.description
          ?.map((b) =>
            b._type === 'block'
              ? b.children?.map((child) => child.text).join('')
              : ''
          )
          .join(' ') || 'No description available.'}
      </p>
      <p className="font-bold">
        {new Intl.NumberFormat('en-US', {
          currency: 'USD',
          style: 'currency',
        }).format(product.price || 0)}
      </p>
    </Link>
  );
}

export default ProductThumbnail;
