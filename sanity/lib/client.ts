import { createClient } from 'next-sanity';

import { apiVersion, dataset, projectId } from '../env';

const baseUrl =
  process.env.NODE_ENV === 'production'
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_BASE_URL;

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
  stega: {
    studioUrl: `${baseUrl}/studio`,
  },
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN,
});
