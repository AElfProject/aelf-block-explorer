/**
 * @file MyWalletCard.js
 * @author huangzongzhe,longyue,zhouminghui
 */
/* eslint-disable fecs-camelcase */
import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import Cookies from 'js-cookie';

// 为组件内建文案提供统一的国际化支持。
import { ConfigProvider, message } from 'antd';

// import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_US from 'antd/lib/locale-provider/en_US';
import { isIESeries } from '@utils/justifyIE';
// import { AppIncrStore } from './Store';
import store from './redux/store';
import config from '../config/config';
import { get } from './utils';
import { IE_ADVICE } from './constants';

import './index.less';

import App from './App';

function initPage() {
  // @TODO: compose mst store to make app running.
  if (isIESeries()) {
    message.error(IE_ADVICE, 60);
  }

  render(
    <ConfigProvider locale={en_US}>
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    </ConfigProvider>,
    document.querySelector('#app')
  );
}

async function getNodesInfo() {
  const nodesInfoProvider = '/nodes/info';
  const nodesInfo = await get(nodesInfoProvider);
  console.log('nodesInfo', nodesInfo);

  if (nodesInfo && nodesInfo.list) {
    const nodesInfoList = nodesInfo.list;
    localStorage.setItem('nodesInfo', JSON.stringify(nodesInfoList));

    // todo: MAIN_CHAIN_ID CHAIN_ID
    const nodeInfo = nodesInfoList.find(item => {
      if (item.chain_id === config.CHAIN_ID) {
        return item;
      }
    });
    const { contract_address, chain_id } = nodeInfo;
    localStorage.setItem('currentChain', JSON.stringify(nodeInfo));
    Cookies.set('aelf_ca_ci', contract_address + chain_id);
    initPage();
  }
  // TODO: turn to 404 page.
}

getNodesInfo();
