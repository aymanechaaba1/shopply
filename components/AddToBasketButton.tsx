'use client';

import { cn } from '@/lib/utils';
import { Product } from '@/sanity/types';
import useBasketStore from '@/zustand/store';
import React, { useEffect, useState } from 'react';

function AddToBasketButton({
  product,
  disabled,
}: {
  product: Product;
  disabled?: boolean;
}) {
  let { addItem, removeItem, getItemCount } = useBasketStore((state) => state);
  let itemCount = getItemCount(product._id);

  let [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    isClient && (
      <div className="flex items-center justify-center space-x-2">
        <button
          onClick={() => removeItem(product._id)}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 bg-gray-200 hover:bg-gray-300',
            {
              'bg-gray-100 cursor-not-allowed': !itemCount,
            }
          )}
          disabled={!itemCount || disabled}
        >
          <span
            className={cn('text-xl font-bold text-gray-600', {
              'text-gray-400': !itemCount,
            })}
          >
            -
          </span>
        </button>
        <span className="w-8 text-center font-semibold">{itemCount}</span>
        <button
          onClick={() => addItem(product)}
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 bg-blue-500 hover:bg-blue-600',
            {
              'bg-gray-400 cursor-not-allowed': disabled,
            }
          )}
          disabled={disabled}
        >
          <span className={cn('text-xl font-bold text-white')}>+</span>
        </button>
      </div>
    )
  );
}

export default AddToBasketButton;
