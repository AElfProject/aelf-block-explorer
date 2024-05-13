import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Tabs } from "antd";
import clsx from "clsx";
import { getTokenAllInfo } from "../../common/utils";
import { TOKEN_PRICE } from "../../api/url";
import { get } from "../../utils";
import Overview from "./components/Overview";

import "./Token.styles.less";
import Transactions from "./components/Transactions";
import Holders from "./components/Holders";
import Contract from "./components/Contract";
import useMobile from "../../hooks/useMobile";
import removeHash from '../../utils/removeHash'
import { symbolToSymbolAlias } from '../../utils/formater';

const keyFromHash = {
  "#balances": "holders",
  "#contract": "contract",
};
export default function Token() {
  const isMobile = useMobile();
  const { symbol } = useParams();
  const alias = symbolToSymbolAlias(symbol);
  const nav = useNavigate();
  const [tokenInfo, setTokenInfo] = useState(undefined);
  const [price, setPrice] = useState(0);
  const [activeKey, setActiveKey] = useState("transactions");
  const fetchTokenInfo = useCallback(async () => {
    const result = await getTokenAllInfo(symbol).catch(() => {
      nav("/search-failed");
    });
    if (result?.symbol === symbol) {
      setTokenInfo(result);
    } else {
      nav(`/search-invalid/${symbol}`);
    }
  }, [symbol]);

  const fetchPrice = useCallback(async () => {
    const result = await get(TOKEN_PRICE, { fsym: symbol, tsyms: "USD" });
    if (result?.symbol === symbol) {
      const { USD } = result;
      setPrice(USD);
    }
  }, [symbol]);

  useEffect(async () => {
    const { hash } = window.location;
    await Promise.all([fetchTokenInfo(), fetchPrice()]);
    if (hash) {
      const key = keyFromHash[hash];
      setActiveKey(key);
    } else {
      setActiveKey("transactions");
    }
  }, [fetchPrice, fetchTokenInfo]);

  const changeTab = (key) => {
    if (key === "transactions") {
      removeHash();
      setActiveKey('transactions')
    } else {
      const index = Object.values(keyFromHash).findIndex((ele) => ele === key);
      window.location.hash = Object.keys(keyFromHash)[index];
    }
  };

  window.addEventListener("hashchange", () => {
    const { hash } = window.location;
    const key = keyFromHash[hash];
    setActiveKey(key || "transactions");
  });
  return (
    <div
      className={clsx(
        "token-page-container basic-container-new",
        isMobile && "mobile"
      )}
    >
      <h2>
        Token<span>{alias || symbol}</span>
      </h2>
      <Overview tokenInfo={tokenInfo} price={price} />
      <section className="more-info">
        <Tabs activeKey={activeKey} onTabClick={(key) => changeTab(key)}>
          <Tabs.TabPane tab="Transactions" key="transactions">
            <Transactions />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Holders" key="holders">
            <Holders />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Contract" key="contract">
            <Contract address={tokenInfo?.contractAddress} />
          </Tabs.TabPane>
        </Tabs>
      </section>
    </div>
  );
}
