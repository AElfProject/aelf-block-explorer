/**
 * @file entry
 * @author atom-yang
 */
import { ConfigProvider } from 'antd';
import moment from 'moment';
import * as Sentry from '@sentry/react';
import enUS from 'antd/lib/locale/en_US';
import { HashRouter } from 'react-router-dom';
import React from 'react';
import { createRoot } from "react-dom/client";
import App from './App';
import config from '../../common/config';
import '../../common/index.less';
import { redirectPageToIframeMode } from '../../common/utils';

redirectPageToIframeMode();
moment.locale('en-us');

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://c95bdbf7fbe441639c8ef0858b67baf8@o414245.ingest.sentry.io/5303396',
    release: `viewer@${process.env.PACKAGE_VERSION}`,
  });
  Sentry.configureScope((scope) => {
    scope.setTag('chainId', config.chainId);
    scope.setExtra('chainId', config.chainId);
    scope.setExtra('pages-id', 'address');
    scope.setTag('pages-id', 'address');
  });
}

const container = document.getElementById("app");
const root = createRoot(container);
root.render(
  <ConfigProvider locale={enUS}>
    <HashRouter>
      <App />
    </HashRouter>
  </ConfigProvider>
);
