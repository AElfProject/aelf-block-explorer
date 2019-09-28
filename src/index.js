/**
 * @file index.js
 * @author huangzongzhe,longyue,zhouminghui
 */
/* eslint-disable fecs-camelcase */
import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import {Provider} from 'mobx-react';
import Cookies from 'js-cookie';

// 为组件内建文案提供统一的国际化支持。
import {LocaleProvider, message} from 'antd';

// import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_US from 'antd/lib/locale-provider/en_US';
import {AppIncrStore} from './Store';
import config from '../config/config';
import {get} from './utils';
import { isIESeries } from '@utils/justifyIE';
import { IE_ADVICE } from './constants';

import './index.less';

import App from './App';

const appIncrStore = AppIncrStore.create({});

function initPage() {
    // @TODO: compose mst store to make app running.
    if(isIESeries()){
        message.error(IE_ADVICE, 60);
    }

    render(
        <LocaleProvider locale={
            en_US
        }>
            <Provider appIncrStore={appIncrStore}>
                <Router>
                    <App />
                </Router>
            </Provider>
        </LocaleProvider>,
        document.querySelector('#app')
    );
}

async function getNodesInfo() {

    const nodesInfoProvider = '/nodes/info';
    const nodesInfo = await get(nodesInfoProvider);
    console.log('nodesInfo', nodesInfo);

    if (nodesInfo.error === 0 && nodesInfo.result && nodesInfo.result.list) {
        const nodesInfoList = nodesInfo.result.list;
        localStorage.setItem('nodesInfo', JSON.stringify(nodesInfoList));

        // todo: MAIN_CHAIN_ID CHAIN_ID
        const nodeInfo = nodesInfoList.find(item => {
            if (item.chain_id === config.MAINCHAINID) {
                return item;
            }
        });
        const {
            contract_address,
            chain_id
        } = nodeInfo;
        localStorage.setItem('currentChain', JSON.stringify(nodeInfo));
        Cookies.set('aelf_ca_ci', contract_address + chain_id);
        initPage();
    }
    // TODO: turn to 404 page.
}

getNodesInfo();
