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
import { Skeleton } from 'antd';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import microApp from '@micro-zoe/micro-app';
import { usePathname, useRouter } from 'next/navigation';
import 'aelf-design/css';
import { AELFDProvider } from 'aelf-design';

const MobileContext = createContext<any>({});

const useMobileContext = () => {
  return useContext(MobileContext);
};
export { useMobileContext };

export default function RootProvider({ children, isMobileSSR }) {
  const router = useRouter();
  const pathname = usePathname();
  const isGovernance = useMemo(() => {
    return ['/proposal', '/vote', '/resource'].find((ele) => pathname.startsWith(ele));
  }, [pathname]);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!isGovernance) {
      // jump from governance to others maybe scroll
      const app = document.querySelector('body');
      if (app) {
        app.scrollIntoView({ block: 'start', behavior: 'auto' });
      }
    }
  }, [pathname, isGovernance, router]);
  useEffect(() => {
    microApp.start({
      lifeCycles: {
        mounted() {
          setShow(true);
        },
      },
    });
    // const onPopstate = () => {
    //   const { href, origin } = window.location;
    //   router.replace(href.replace(origin, ''));
    // };
    // window.addEventListener('popstate', onPopstate);
    microApp.addDataListener('governance', ({ pathname: path }) => {
      // jump at remote app
      setTimeout(
        () =>
          window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth',
          }),
        0,
      );
      router.push(path);
    });
    return () => {
      // window.removeEventListener('popstate', onPopstate);
      microApp.clearDataListener('governance');
    };
  }, [pathname, router]);

  return (
    <AELFDProvider prefixCls="explorer">
      <MobileContext.Provider value={{ isMobileSSR: isMobileSSR }}>
        <ReduxProvider store={store}>{children}</ReduxProvider>
        {isGovernance && (
          <>
            <micro-app name="governance" url={process.env.NEXT_PUBLIC_REMOTE_URL} keep-alive></micro-app>
            {!show && <Skeleton className="governance-skeleton" paragraph={{ rows: 4 }} />}
          </>
        )}
      </MobileContext.Provider>
    </AELFDProvider>
  );
}
