/**
 * @file account info
 * @author
 */
import React, { useEffect, useState } from 'react';
import { Layout, Tabs, Typography, Modal, Tooltip } from 'antd';
import QRCode from 'qrcode.react';
import { QrcodeOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import OldTransactionList from 'page-components/Address/OldTransactionList';
import DetailHeader from 'components/DetailHeader';
import TokenList from 'page-components/Address/TokenList';
import config from 'constants/viewerApi';
import { getBalances, sendHeight, getContractNames } from 'utils/utils';
require('styles/common.less');
import Bread from 'page-components/Address/Bread';
import TransferList from 'page-components/Address/TransferList';
require('./index.less');
import withNoSSR from 'utils/withNoSSR';

const { Paragraph } = Typography;
const { Content } = Layout;

async function getHeaderColumns(address, symbol) {
  const balances = await getBalances(address);
  let elfBalances = balances.filter((v) => v.symbol === symbol);
  const balancesWithoutELF = balances.filter((v) => v.symbol !== symbol).sort((a, b) => b.balance - a.balance);
  elfBalances = elfBalances.length === 0 ? 0 : elfBalances[0].balance;
  return [
    {
      tip: 'Account Address',
      name: 'Account',
      desc: (
        <div className="address-container">
          <Paragraph copyable>{`ELF_${address}_${config.viewer.chainId}`}</Paragraph>
          &nbsp;
          <Tooltip title="QRCode">
            <QrcodeOutlined
              className="address-qrcode main-color"
              onClick={() => {
                Modal.info({
                  mask: false,
                  maskClosable: true,
                  title: `ELF_${address}_${config.viewer.chainId}`,
                  content: (
                    <QRCode
                      value={`ELF_${address}_${config.viewer.chainId}`}
                      style={{
                        height: '90%',
                        width: '90%',
                      }}
                    />
                  ),
                  onOk() {
                    // no content
                  },
                });
              }}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      tip: `${symbol} Balance`,
      name: 'Balance',
      desc: `${Number(elfBalances).toLocaleString()} ${symbol}`,
    },
    {
      tip: 'Tokens owned',
      name: 'Tokens',
      desc: <TokenList balances={balancesWithoutELF} />,
    },
  ];
}

const { TabPane } = Tabs;

const accountBread = [
  {
    title: 'Account List',
    path: '/address',
  },
  {
    title: 'Account',
  },
];

const AccountInfo = () => {
  const router = useRouter();
  const routerParams = router.query;
  const { symbol = 'ELF', address } = routerParams;
  const [columns, setColumns] = useState([]);
  const navigate = router.push;
  const [contracts, setContracts] = useState({});
  useEffect(() => {
    getContractNames()
      .then((res) => setContracts(res))
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    if (contracts[address]) {
      navigate(`/contract/${address}`);
    }
  }, [contracts]);
  useEffect(() => {
    getHeaderColumns(address, symbol)
      .then((res) => {
        setColumns(res);
        sendHeight(500);
      })
      .catch((e) => {
        sendHeight(500);
        console.error(e);
      });
  }, [address, symbol]);
  return (
    <Layout>
      <Content>
        <div className="main-container account-info-container">
          <Bread title="Account" subTitle={`ELF_${address}_${config.viewer.chainId}`} breads={accountBread} />
          <DetailHeader columns={columns} />
          <Tabs>
            <TabPane tab="Transactions" key="transactions">
              <OldTransactionList owner={address} api={config.API_PATH.GET_TRANSACTION_BY_ADDRESS} />
            </TabPane>
            <TabPane tab="Transfers" key="transfers">
              <TransferList owner={address} api={config.API_PATH.GET_TRANSFER_LIST} />
            </TabPane>
          </Tabs>
        </div>
      </Content>
    </Layout>
  );
};

export default React.memo(withNoSSR(AccountInfo));
