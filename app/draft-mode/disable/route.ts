import { client } from '@/sanity/lib/client';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  await (await draftMode()).disable();
  return NextResponse.redirect(new URL('/', request.url));
}
