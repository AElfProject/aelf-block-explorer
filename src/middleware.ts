import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const queryTxt = pathname.split('/').pop();
    if (queryTxt === 'about') {
      return NextResponse.rewrite(new URL('/blocks', request.url));
    } else if (pathname.includes('token') || pathname.includes('nft')) {
      const chainId = pathname.split('/')[1];
      console.log(pathname, chainId, CHAIN_ID);
      if (chainId !== CHAIN_ID) {
        return NextResponse.redirect(new URL(`/${CHAIN_ID}/search-failed`, request.url));
      }
    }
  } catch (e) {
    throw new Error('middleware execute fail');
  }

  // return NextResponse.redirect(new URL('/blocks', request.url));
}

export const config = {
  matcher: '/search/:path*',
};
