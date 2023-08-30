import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  try {
    const queryTxt = request.nextUrl.pathname.split('/').pop();
  } catch (e) {
    throw new Error('middleware execute fail');
  }

  return NextResponse.redirect(new URL('/blocks', request.url));
}

export const config = {
  matcher: '/search/:path*',
};
