/*
 * @Author: aelf-lxy
 * @Date: 2023-08-01 20:31:39
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 15:02:03
 * @Description: empty
 */

'use client';

import { Provider as ReduxProvider } from 'react-redux';
import store from '@_store';
import { ConfigProvider } from 'antd';
import { useEffect } from 'react';
import microApp from '@micro-zoe/micro-app';
import { useRouter } from 'next/navigation';
export default function RootProvider({ children }) {
  const router = useRouter();
  useEffect(() => {
    microApp.start();
    window.addEventListener('popstate', () => {
      const { href, origin } = window.location;
      router.replace(href.replace(origin, ''));
    });
  }, [router]);
  return (
    <ConfigProvider>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </ConfigProvider>
  );
}
