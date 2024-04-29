/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:37:10
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 15:57:46
 * @Description: root layout
 */

import '@_style/globals.css';
import type { Metadata } from 'next';
import RootProvider from './pageProvider';
import Header from '@_components/Header';
import Footer from '@_components/Footer';
import MainContainer from '@_components/Main';
import { headers } from 'next/headers';
import { isMobileOnServer } from '@_utils/isMobile';
import { Suspense } from 'react';
import { NetworkItem } from '@_types';
import request from '@_api';
import StyleRegistry from './StyleRegistry';
import { fetchCMS } from '@_api/fetchCMS';
import { PublicEnvProvider } from 'next-runtime-env';
import type { Viewport } from 'next';
import { revalidatePath } from 'next/cache';

export const metadata: Metadata = {
  title: 'AELF Block Explorer',
  description: 'AELF explorer',
};
async function fetchData() {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const res = {
    price: { USD: 1 },
    previousPrice: { usd: 2 },
  };
  // const res = await request.common.getPrice({ cache: 'no-store' } as Request);
  return res;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  revalidatePath('/', 'layout');
  const data = await fetchData();
  const { price, previousPrice } = data;
  const headersList = headers();
  const isMobile = isMobileOnServer(headersList);
  const { headerMenuList, footerMenuList, chainList, networkList } = await fetchCMS();
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <div className="relative box-border min-h-screen bg-global-grey">
          <PublicEnvProvider>
            <StyleRegistry>
              <RootProvider isMobileSSR={isMobile}>
                <Suspense>
                  <Header chainList={chainList} networkList={networkList} headerMenuList={headerMenuList} />
                </Suspense>
                <Suspense>
                  <MainContainer isMobileSSR={isMobile}>{children}</MainContainer>
                </Suspense>
                <Suspense>
                  <Footer isMobileSSR={isMobile} footerMenuList={footerMenuList} />
                </Suspense>
              </RootProvider>
            </StyleRegistry>
          </PublicEnvProvider>
        </div>
      </body>
    </html>
  );
}

// By default server components are statically generated at build-time. To make
// sure the env vars are actually loaded use, add the following line to server
// components that use [env]. 👇
export const dynamic = 'force-dynamic';

// https://nextjs.org/docs/app/api-reference/functions/generate-viewport#the-viewport-object
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};
