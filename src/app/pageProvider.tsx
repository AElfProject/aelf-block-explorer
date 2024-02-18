/*
 * @Author: aelf-lxy
 * @Date: 2023-08-01 20:31:39
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 15:02:03
 * @Description: empty
 */

'use client';

import { PREFIXCLS, THEME_CONFIG } from '@_lib/AntdThemeConfig';
import { makeStore, AppStore } from '@_store';
// import { wrapper } from '@_store';
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import microApp from '@micro-zoe/micro-app';
import { AELFDProvider } from 'aelf-design';
import 'aelf-design/css';
import { ConfigProvider, Skeleton } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { Provider as ReduxProvider } from 'react-redux';

const MobileContext = createContext<any>({});

const useMobileContext = () => {
  return useContext(MobileContext);
};
export { useMobileContext };

function RootProvider({ children, isMobileSSR }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

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
    <AELFDProvider prefixCls={PREFIXCLS} theme={THEME_CONFIG}>
      <ConfigProvider prefixCls={PREFIXCLS} theme={THEME_CONFIG}>
        <MobileContext.Provider value={{ isMobileSSR: isMobileSSR }}>
          <ReduxProvider store={storeRef.current}>{children}</ReduxProvider>
          {/* {children} */}
          {isGovernance && (
            <>
              <micro-app name="governance" url={process.env.NEXT_PUBLIC_REMOTE_URL} keep-alive></micro-app>
              {!show && <Skeleton className="governance-skeleton" paragraph={{ rows: 4 }} />}
            </>
          )}
        </MobileContext.Provider>
      </ConfigProvider>
    </AELFDProvider>
  );
}

export default RootProvider;
