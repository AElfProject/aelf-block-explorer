/**
 * @file account info
 * @author
 */
import React, { useEffect, useState } from 'react';
import {
  Layout, message,
  Tabs,
} from 'antd';
import {
  useParams,
} from 'react-router-dom';
import TransactionList from '../../components/TransactionList';
import DetailHeader from '../../../../components/DetailHeader';
import config from '../../../../common/config';
import {
  getTokenAllInfo,
  sendHeight,
} from '../../../../common/utils';
import '../../../../common/index.less';
import Bread from '../../components/Bread';
import HolderList from '../../components/HolderList';

const {
  Content,
} = Layout;

async function getHeaderColumns(symbol) {
  const tokenInfo = await getTokenAllInfo(symbol);
  if (Object.keys(tokenInfo).length === 0) {
    message.error(`There is no such token ${symbol}`);
    return null;
  }
  const {
    totalSupply,
    supply,
    transfers,
    holders,
  } = tokenInfo;
  return [
    {
      tip: 'Token Name',
      name: 'Token Name',
      desc: symbol,
    },
    {
      tip: 'Total Supply',
      name: 'Total Supply',
      desc: `${Number(totalSupply).toLocaleString()} ${symbol}`,
    },
    {
      tip: 'Circulating Supply',
      name: 'Circulating Supply',
      desc: `${Number(supply).toLocaleString()} ${symbol}`,
    },
    {
      tip: 'Holders',
      name: 'Holders',
      desc: Number(holders).toLocaleString(),
    },
    {
      tip: 'Transfers',
      name: 'Transfers',
      desc: Number(transfers).toLocaleString(),
    },
  ];
}

const {
  TabPane,
} = Tabs;

const tokenBreads = [
  {
    title: 'Token List',
    path: '/token',
  },
  {
    title: 'Token',
  },
];

const TokenInfo = () => {
  const freezeParams = useParams();
  const {
    symbol = 'ELF',
  } = freezeParams;
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    getHeaderColumns(symbol).then((res) => {
      setColumns(res);
      sendHeight(500);
    }).catch((e) => {
      sendHeight(500);
      console.error(e);
    });
  }, [symbol]);
  return (
    <Layout>
      <Content>
        <div className="main-container">
          <Bread
            title="Token"
            subTitle={symbol}
            breads={tokenBreads}
          />
          <DetailHeader columns={columns} />
          <Tabs>
            <TabPane tab="Transactions" key="transaction">
              <TransactionList
                api={config.API_PATH.GET_TOKENS_TRANSACTION}
                freezeParams={freezeParams}
                rowKey="txId"
              />
            </TabPane>
            <TabPane tab="Holders" key="holders">
              <HolderList symbol={symbol} />
            </TabPane>
          </Tabs>
        </div>
      </Content>
    </Layout>
  );
};

export default React.memo(TokenInfo);
