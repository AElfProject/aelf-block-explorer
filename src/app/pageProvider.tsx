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
import { ConfigProvider, Skeleton } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import microApp from '@micro-zoe/micro-app';
import { usePathname, useRouter } from 'next/navigation';
export default function RootProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isGovernance = useMemo(
    () => ['/proposal', '/vote', '/resource'].find((ele) => pathname.startsWith(ele)),
    [pathname],
  );
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (isGovernance) {
      setShow(true);
    } else {
      const app = document.querySelector('.next-app');
      if (app) {
        app.scrollIntoView({ block: 'start', behavior: 'auto' });
      }
    }
  }, [pathname, isGovernance, router]);
  useEffect(() => {
    microApp.start();
    const onPopstate = () => {
      const { href, origin } = window.location;
      router.replace(href.replace(origin, ''));
    };
    // window.addEventListener('popstate', onPopstate);
    microApp.addDataListener('governance', ({ type, pathname: path }) => {
      router.push(path);

      // jump at remote app
      if (type === 'pushstate' || type === 'popstate') {
        setTimeout(
          () =>
            window.scroll({
              top: 0,
              left: 0,
              behavior: 'smooth',
            }),
          0,
        );
      }
    });
    return () => {
      window.removeEventListener('popstate', onPopstate);
      microApp.clearDataListener('governance');
    };
  }, [pathname]);

  return (
    <ConfigProvider>
      <ReduxProvider store={store}>{children}</ReduxProvider>
      {isGovernance &&
        (show ? (
          <micro-app name="governance" url={process.env.NEXT_PUBLIC_REMOTE_URL} keep-alive></micro-app>
        ) : (
          <Skeleton className="governance-skeleton" paragraph={{ rows: 4 }} />
        ))}
    </ConfigProvider>
  );
}
