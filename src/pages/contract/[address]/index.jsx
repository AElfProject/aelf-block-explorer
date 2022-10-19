/**
 * @file App
 * @author
 */
import React, { useEffect, useState } from 'react';
import Decimal from 'decimal.js';
import { Layout, Tabs, Typography } from 'antd';
import { useRouter } from 'next/router';
import Reader from './Reader';
import { GlobalContext } from 'constants/misc';
import { detectMobileBrowser } from 'utils/utils';
import OldTransactionList from 'page-components/Address/OldTransactionList';
import DetailHeader from 'components/DetailHeader';
import TokenList from 'page-components/Address/TokenList';
import config from 'constants/viewerApi';
import { getBalances, getContractDividend, getTokenList, sendHeight } from 'utils/utils';
import Dividends from 'components/Dividends';
require('styles/common.less');
require('./index.less');
import Bread from 'page-components/Address/Bread';
import EventList from 'page-components/Address/EventList';
import TransferList from 'page-components/Address/TransferList';
import withNoSSR from 'utils/withNoSSR';

const { Paragraph } = Typography;
const { Content } = Layout;

const isMobile = detectMobileBrowser();
const context = {
  isMobile,
};

async function getHeaderColumns(address) {
  const [balances, dividends, tokens] = await Promise.all([
    getBalances(address),
    getContractDividend(address),
    getTokenList(),
  ]);
  Object.keys(dividends || {}).forEach((key) => {
    dividends[key] = new Decimal(dividends[key]).dividedBy(`1e${(tokens[key] || {}).decimals || 8}`).toString();
  });
  let elfBalances = balances.filter((v) => v.symbol === 'ELF');
  const balancesWithoutELF = balances.filter((v) => v.symbol !== 'ELF').sort((a, b) => b.balance - a.balance);
  elfBalances = elfBalances.length === 0 ? 0 : elfBalances[0].balance;
  return [
    {
      tip: 'Contract Address',
      name: 'Address',
      desc: <Paragraph copyable>{`ELF_${address}_${config.viewer.chainId}`}</Paragraph>,
    },
    {
      tip: 'ELF Balance',
      name: 'Balance',
      desc: `${elfBalances} ELF`,
    },
    {
      tip: 'Contract Dividends',
      name: 'Dividends',
      desc: <Dividends dividends={dividends} />,
    },
    {
      tip: 'Tokens owned',
      name: 'Tokens',
      desc: <TokenList balances={balancesWithoutELF} />,
    },
  ];
}

const { TabPane } = Tabs;

const contractBread = [
  {
    title: 'Contract List',
    path: '/contract',
  },
  {
    title: 'Contract',
  },
];

const ContractInfo = () => {
  const router = useRouter();
  const { address } = router.query;
  const [columns, setColumns] = useState([]);
  useEffect(() => {
    getHeaderColumns(address)
      .then((res) => {
        sendHeight(700);
        setColumns(res);
      })
      .catch((e) => {
        sendHeight(700);
        console.error(e);
      });
  }, [address]);
  return (
    <GlobalContext.Provider value={context}>
      <Layout>
        <Content>
          <div className="contract-viewer">
            <Bread title="Contract" subTitle={`ELF_${address}_${config.viewer.chainId}`} breads={contractBread} />
            <DetailHeader columns={columns} />
            <Tabs>
              <TabPane tab="Transactions" key="transactions">
                <OldTransactionList owner={address} api={config.API_PATH.GET_TRANSACTION_BY_ADDRESS} />
              </TabPane>
              <TabPane tab="Transfers" key="transfers">
                <TransferList owner={address} api={config.API_PATH.GET_TRANSFER_LIST} />
              </TabPane>
              <TabPane tab="Contract" key="contract">
                <Reader />
              </TabPane>
              <TabPane tab="Events" key="events">
                <EventList contractAddress={address} />
              </TabPane>
            </Tabs>
          </div>
        </Content>
      </Layout>
    </GlobalContext.Provider>
  );
};

export default React.memo(withNoSSR(ContractInfo));
