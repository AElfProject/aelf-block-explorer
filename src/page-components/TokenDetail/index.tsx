import React, { useCallback, useEffect, useState } from 'react';
import { Tabs } from 'antd';
import clsx from 'clsx';
import { getTokenAllInfo } from 'utils/utils';
import { TOKEN_PRICE } from 'constants/viewerApi';
import { get } from 'utils/axios';
import Overview from './components/Overview';
import Transactions from './components/Transactions';
import Holders from './components/Holders';
import Contract from './components/Contract';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';
import { useRouter } from 'next/router';

require('./index.less');

export default function Token({
  tokeninfossr: tokenInfoSSR,
  pricessr: priceSSR,
  datasourcessr: dataSourceSSR,
  actual_total_ssr: actualTotalSSR,
  headers,
}) {
  const router = useRouter();
  const { symbol } = router.query;
  const nav = router.push;
  const [tokenInfo, setTokenInfo] = useState(tokenInfoSSR);
  const [price, setPrice] = useState(priceSSR || 0);
  const [isMobile, setIsMobile] = useState(!!isPhoneCheckSSR(headers));

  useEffect(() => {
    setIsMobile(!!isPhoneCheck());
  }, []);
  const fetchTokenInfo = useCallback(async () => {
    const result = await getTokenAllInfo(symbol).catch(() => {
      nav('/search-failed');
    });
    if (result?.symbol === symbol) {
      setTokenInfo(result);
    } else {
      nav(`/search-invalid/${symbol}`);
    }
  }, [symbol]);

  const fetchPrice = useCallback(async () => {
    const result = await get(TOKEN_PRICE, { fsym: symbol, tsyms: 'USD' });
    if (result?.symbol === symbol) {
      const { USD } = result;
      setPrice(USD);
    }
  }, [symbol]);

  useEffect(() => {
    fetchTokenInfo();
    fetchPrice();
  }, [fetchPrice, fetchTokenInfo]);

  return (
    <div className={clsx('token-page-container basic-container-new', isMobile && 'mobile')}>
      <h2>
        Token<span>{symbol}</span>
      </h2>
      <Overview tokenInfo={tokenInfo} price={price} />
      <section className="more-info">
        <Tabs>
          <Tabs.TabPane tab="Transactions" key="transactions">
            <Transactions dataSource={dataSourceSSR} actualTotal={actualTotalSSR} headers={headers} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Holders" key="holders">
            <Holders />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Contract" key="contract">
            <Contract address={tokenInfo?.contractAddress} headers={headers} />
          </Tabs.TabPane>
        </Tabs>
      </section>
    </div>
  );
}
