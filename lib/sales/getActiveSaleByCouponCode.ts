import { defineQuery } from 'next-sanity';
import { CouponCode } from './couponCodes';
import { client } from '@/sanity/lib/client';

export let getActiveSaleByCouponCode = async (couponCode: CouponCode) => {};
