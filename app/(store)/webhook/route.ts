import stripe from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { Metadata } from '../basket/page';
import { client } from '@/sanity/lib/client';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get('stripe-signature');

  if (!sig)
    return NextResponse.json({ error: 'No Signature' }, { status: 400 });

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE WEBHOOK SECRET IS NOT SET');
    return NextResponse.json(
      { error: 'STRIPE WEBHOOK SECRET IS NOT SET' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: 'WEBHOOK VERIFICATION FAILED.' },
      { status: 400 }
    );
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;

      try {
        const order = await createOrderInSanity(session);
      } catch (error) {
        return NextResponse.json(
          { error: 'Error creating this order.' },
          { status: 500 }
        );
      }
  }

  return NextResponse.json({ received: true });
}

async function createOrderInSanity(session: Stripe.Checkout.Session) {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;

  const { orderNumber, customerName, customerEmail, clerkUserId } =
    metadata as Metadata;

  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    {
      expand: ['data.price.product'],
    }
  );

  const sanityProducts = lineItemsWithProduct.data.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: 'reference',
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item.quantity || 0,
  }));

  const order = await client.create({
    _type: 'order',
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName,
    stripeCustomerId: customer,
    clerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,
    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: 'paid',
    orderDate: new Date().toISOString(),
  });

  return order;
}
