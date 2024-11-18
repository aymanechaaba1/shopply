'use server';

import { Metadata } from '@/app/(store)/basket/page';
import { imageUrl } from '@/lib/imageUrl';
import stripe from '@/lib/stripe';
import { BasketItem } from '@/zustand/store';

export async function createCheckoutSession(
  groupedItems: { product: BasketItem['product']; quantity: number }[],
  metadata: Metadata
) {
  let itemsWithoutPrice = groupedItems.filter((item) => !item.product.price);
  if (itemsWithoutPrice.length > 0)
    throw new Error(`some items do not have a price.`);
  try {
    let customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const baseUrl =
      process.env.NODE_ENV === 'production'
        ? `https://shopply-rho.vercel.app`
        : process.env.NEXT_PUBLIC_BASE_URL;

    const successUrl = `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`;
    const cancelUrl = `${baseUrl}/basket`;

    let session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : 'always',
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata,
      mode: 'payment',
      allow_promotion_codes: true,
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: groupedItems.map((item) => ({
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(item.product.price! * 100),
          product_data: {
            name: item.product.name || 'Unamed Product',
            description: `Product ID: ${item.product._id}`,
            metadata: {
              id: item.product._id,
            },
            images: item.product.image
              ? [imageUrl(item.product.image).url()]
              : undefined,
          },
        },
        quantity: item.quantity,
      })),
    });
    return session.url;
  } catch (error) {
    throw error;
  }
}
