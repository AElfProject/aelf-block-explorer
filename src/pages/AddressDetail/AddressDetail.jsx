import React, { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useNavigate, useParams } from "react-router";
import { Tabs, Tooltip } from "antd";
import { useEffectOnce } from "react-use";
import CopyButton from "../../components/CopyButton/CopyButton";
import IconFont from "../../components/IconFont";
import QrCode from "./components/QrCode/QrCode";
import { get, getContractNames } from "../../utils";
import {
  TOKEN_PRICE,
  VIEWER_BALANCES,
  VIEWER_GET_FILE,
  VIEWER_HISTORY,
} from "../../api/url";

import "./AddressDetail.styles.less";
import useMobile from "../../hooks/useMobile";
import CommonTabPane from "./components/CommonTabPane";
import Overview from "./components/Overview";
import ContractTabPane from "./components/ContractTabPane";
import { isAddress } from "../../utils/utils";
import addressFormat from "../../utils/addressFormat";
import removeHash from "../../utils/removeHash";

const keyFromHash = {
  "#txns": "transactions",
  "#transfers": "transfers",
  "#contract": "contract",
  "#events": "events",
  "#history": "history",
};
export default function AddressDetail() {
  const nav = useNavigate();
  const { address: prefixAddress, codeHash } = useParams();
  const isMobile = useMobile();
  const [activeKey, setActiveKey] = useState("tokens");
  const [contracts, setContracts] = useState({});
  const [prices, setPrices] = useState({});
  const [balances, setBalances] = useState([]);
  const [tokensLoading, setTokensLoading] = useState(true);
  const [contractInfo, setContractInfo] = useState(undefined);
  const [contractHistory, setContractHistory] = useState(undefined);
  const address = prefixAddress.split("_")[1];
  const isCA = useMemo(() => !!contracts[address], [contracts, address]);

  const elfBalance = useMemo(
    () => balances.find((item) => item.symbol === "ELF")?.balance,
    [balances]
  );

  const pageTitle = useMemo(() => {
    return isCA ? "Contract" : "Address";
  }, [isCA]);

  const fetchBalances = useCallback(async () => {
    setTokensLoading(true);
    const result = await get(VIEWER_BALANCES, { address });
    if (result?.code === 0) {
      const { data } = result;
      setBalances(data);
    } else {
      nav("/search-failed");
    }
  }, [address]);

  const fetchPrice = useCallback(async () => {
    if (balances.length) {
      setPrices({});
      await Promise.allSettled(
        balances.map((item) =>
          get(TOKEN_PRICE, { fsym: item.symbol, tsyms: "USD" })
        )
      ).then((res) => {
        setTokensLoading(false);
        res.forEach(({ value: item }) => {
          if (item && item.USD) {
            setPrices((v) => ({ ...v, [item.symbol]: item.USD }));
          }
        });
      });
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
      nav("/search-failed");
    }
  }, [address]);

  const fetchFile = useCallback(async () => {
    const result = await get(VIEWER_GET_FILE, { address, codeHash });
    if (result?.code === 0) {
      const { data } = result;
      setContractInfo(data);
    } else {
      nav("/search-failed");
    }
  }, [address, codeHash]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  useEffect(() => {
    fetchPrice();
  }, [balances]);

  useEffect(() => {
    const { hash } = window.location;
    const key = keyFromHash[hash];
    setActiveKey(key || "tokens");
    if (isCA) {
      fetchFile();
      fetchHistory();
    }
  }, [isCA, fetchFile]);

  useEffectOnce(() => {
    getContractNames().then((res) => setContracts(res));
  });

  useEffect(() => {
    const res = isAddress(address);
    if (!res) {
      nav(`/search-invalid/${address}`);
    }
  }, [address]);

  const changeTab = (key) => {
    if (key === "tokens") {
      removeHash();
      setActiveKey("tokens");
    } else {
      const index = Object.values(keyFromHash).findIndex((ele) => ele === key);
      window.location.hash = Object.keys(keyFromHash)[index];
    }
  };

  window.addEventListener("hashchange", () => {
    const { hash } = window.location;
    const key = keyFromHash[hash];
    setActiveKey(key || "tokens");
  });
  return (
    <div
      className={clsx(
        "address-detail-page-container basic-container-new",
        isMobile && "mobile"
      )}
    >
      <section className="basic-info">
        <h2>{pageTitle}</h2>
        <p>
          {addressFormat(address)}
          <CopyButton value={addressFormat(address)} />
          <Tooltip
            placement={isMobile ? "bottomRight" : "bottom"}
            color="white"
            getPopupContainer={(node) => node}
            trigger="click"
            title={<QrCode value={`${addressFormat(address)}`} />}
          >
            <IconFont type="code" />
          </Tooltip>
        </p>
      </section>
      <Overview prices={prices} elfBalance={elfBalance} />
      <section className="more-info">
        <Tabs activeKey={activeKey} onTabClick={(key) => changeTab(key)}>
          {CommonTabPane({ balances, prices, tokensLoading, address }).map(
            ({ children, ...props }) => (
              <Tabs.TabPane key={props.key} tab={props.tab}>
                {children}
              </Tabs.TabPane>
            )
          )}
          {isCA &&
            ContractTabPane({
              contractInfo,
              contractHistory,
              address,
              codeHash,
              activeKey,
              onTabClick:(key)=>{
                setActiveKey(key);
              }
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
