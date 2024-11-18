// ./src/sanity/lib/queries.ts

import { defineQuery } from 'next-sanity';

export const ALL_PRODUCTS_QUERY = defineQuery(`
  *[
    _type == 'product'
  ] | order(name asc)
`);

export const ALL_CATEGORIES_QUERY = defineQuery(`
  *[
    _type == 'category'
  ] | order(name asc)
  `);

export const ACTIVE_SALE_BY_COUPON_QUERY = defineQuery(`
  *[
    _type == 'sale'
    && isActive == true
    && couponCode == $couponCode
  ] | order(validFrom desc)[0]
  `);

export const PRODUCTS_SEARCH_QUERY = defineQuery(`
  *[
    _type == 'product'
    && name match $searchParam
  ] | order(name asc)
  `);

export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[
    _type == 'product'
    && slug.current == $slug
  ] | order(name asc) [0]
  `);

export const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`
  *[
    _type == 'product'
    && references(*[_type == 'category' && slug.current == $categorySlug]._id)
  ] | order(name asc)
  `);

export const ALL_ORDERS_QUERY = defineQuery(`
  *[
    _type == 'order'
    && clerkUserId == $userId
  ] | order(orderDate desc) {
    ...,
    products[]{
      ...,
      product->
    }
  }
  `);
