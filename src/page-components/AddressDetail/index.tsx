import React, { useCallback, useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { Tabs, Tooltip } from 'antd';
import { useEffectOnce } from 'react-use';
import CopyButton from 'components/CopyButton/CopyButton';
import IconFont from 'components/IconFont';
import config from 'constants/config/config';
import QrCode from './components/QrCode/QrCode';
import { get, getContractNames } from 'utils/axios';
import { TOKEN_PRICE, VIEWER_BALANCES, VIEWER_GET_FILE, VIEWER_HISTORY } from 'constants/viewerApi';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';
import CommonTabPane from './components/CommonTabPane';
import Overview from './components/Overview';
import ContractTabPane from './components/ContractTabPane';
import { isAddress } from 'utils/utils';
import { useRouter } from 'next/router';
import { IBalance } from './types';
require('./index.less');
export default function AddressDetail({
  balancesssr: balancesSSR,
  pricesssr: pricesSSR,
  contractinfossr: contractInfoSSR,
  contracthistoryssr: contractHistorySSR,
  activekeyssr: activeKeySSR,
  contractsssr: contractsSSR,
  headers,
}) {
  const router = useRouter();
  const nav = router.push;
  const { address, codeHash } = router.query as { address: string; codeHash: string };
  let isMobile = !!isPhoneCheckSSR(headers);
  const [activeKey, setActiveKey] = useState(activeKeySSR || 'tokens');
  const [contracts, setContracts] = useState(contractsSSR || {});
  const [prices, setPrices] = useState(pricesSSR || {});
  const [balances, setBalances] = useState(balancesSSR || []);
  const [tokensLoading, setTokensLoading] = useState(false);
  const [contractInfo, setContractInfo] = useState(contractInfoSSR);
  const [contractHistory, setContractHistory] = useState(contractHistorySSR);

  const isCA = useMemo(() => !!contracts[address as string], [contracts, address]);

  const elfBalance = useMemo(() => {
    const temp: IBalance = balances.find((item: IBalance) => item.symbol === 'ELF')!;
    return temp?.balance;
  }, [balances]);

  const pageTitle = useMemo(() => {
    return isCA ? 'Contract' : 'Address';
  }, [isCA]);

  useEffect(() => {
    isMobile = !!isPhoneCheck();
  }, []);
  const fetchBalances = useCallback(async () => {
    setTokensLoading(true);
    const result = await get(VIEWER_BALANCES, { address });
    if (result?.code === 0) {
      const { data } = result;
      setBalances(data);
    } else {
      nav('/search-failed');
    }
  }, [address]);

  const fetchPrice = useCallback(async () => {
    if (balances.length) {
      await Promise.allSettled(
        balances.map((item: IBalance) => get(TOKEN_PRICE, { fsym: item.symbol, tsyms: 'USD' })),
      ).then(
        (res: any) => {
          setTokensLoading(false);
          res.forEach(({ value: item }) => {
            if (item && item.USD) {
              setPrices((v) => ({ ...v, [item.symbol]: item.USD }));
            }
          });
        },
        () => {
          setPrices({});
        },
      );
    } else {
      setTokensLoading(false);
    }
  }, [balances]);

  const fetchHistory = useCallback(async () => {
    const result = await get(VIEWER_HISTORY, { address });
    if (result?.code === 0) {
      const { data } = result;
      setContractHistory(data);
    } else {
      nav('/search-failed');
    }
  }, [address]);

  const fetchFile = useCallback(async () => {
    const result = await get(VIEWER_GET_FILE, { address, codeHash });
    if (result?.code === 0) {
      const { data } = result;
      setContractInfo(data);
    } else {
      nav('/search-failed');
    }
  }, [address, codeHash]);

  // useEffect(() => {
  //   fetchBalances();
  // }, [fetchBalances]);

  // useEffect(() => {
  //   fetchPrice();
  // }, [balances]);

  // useEffect(() => {
  //   if (isCA) {
  //     fetchFile();
  //     fetchHistory();
  //     setActiveKey('contract');
  //   } else {
  //     setActiveKey('tokens');
  //   }
  // }, [isCA, fetchFile]);

  // useEffectOnce(() => {
  //   getContractNames().then((res) => setContracts(res));
  // });

  useEffect(() => {
    const res = isAddress(address);
    if (!res) {
      nav(`/search-invalid/${address}`);
    }
  }, [address]);

  return (
    <div className={clsx('address-detail-page-container basic-container-new', isMobile && 'mobile')}>
      <section className="basic-info">
        <h2>{pageTitle}</h2>
        <p>
          {address}
          <CopyButton value={address} />
          <Tooltip
            placement={isMobile ? 'bottomRight' : 'bottom'}
            color="white"
            getPopupContainer={(node) => node}
            trigger="click"
            title={<QrCode value={`ELF_${address}_${config.CHAIN_ID}`} />}>
            <IconFont type="code" />
          </Tooltip>
        </p>
      </section>
      <Overview prices={prices} elfBalance={elfBalance} />
      <section className="more-info">
        <Tabs activeKey={activeKey} onTabClick={(key) => setActiveKey(key)}>
          {CommonTabPane({ balances, prices, tokensLoading, address, headers }).map(({ children, ...props }) => (
            <Tabs.TabPane key={props.key} tab={props.tab}>
              {children}
            </Tabs.TabPane>
          ))}
          {isCA &&
            ContractTabPane({
              contractInfo,
              contractHistory,
              address,
              codeHash,
              activeKey,
              headers,
            }).map(({ children, ...props }) => (
              <Tabs.TabPane key={props.key} tab={props.tab}>
                {children}
              </Tabs.TabPane>
            ))}
        </Tabs>
      </section>
    </div>
  );
}
