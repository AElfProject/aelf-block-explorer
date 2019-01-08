import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';

// 为组件内建文案提供统一的国际化支持。
import { LocaleProvider } from 'antd';

// import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_US from 'antd/lib/locale-provider/en_US';
import { AppIncrStore } from './Store';

import './index.less';

import App from './App';

const appIncrStore = AppIncrStore.create({});

// @TODO: compose mst store to make app running.
render(
    < LocaleProvider locale = {
        en_US
    } >
        <Provider appIncrStore={appIncrStore}>
            <Router>
                <App />
            </Router>
        </Provider>
    </LocaleProvider>,
    document.querySelector('#app')
);
