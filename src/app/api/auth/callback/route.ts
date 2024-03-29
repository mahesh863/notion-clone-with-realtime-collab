import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  const requestUrl = new URL(req.nextUrl);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const superbase = createRouteHandlerClient({ cookies });
    await superbase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
}
