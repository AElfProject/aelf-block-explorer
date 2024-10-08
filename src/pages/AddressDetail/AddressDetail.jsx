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
import { CHAIN_ID } from "../../constants";
import { EXPLORER_V2_LINK } from "../../common/constants";
import { NETWORK_TYPE } from "../../../config/config";

const keyFromHash = {
  "#txns": "transactions",
  "#tokentxns": "tokenTransfers",
  "#nfttransfers": "nftTransfers",
  "#contract": "contract",
  "#events": "events",
  "#history": "history",
};
// compatible with old url
const formatAddress = prefixAddress => {
  if (prefixAddress.indexOf("_") > -1) {
    return prefixAddress.split("_")[1];
  }
  return prefixAddress;
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
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState(0);
  const address = formatAddress(prefixAddress);
  const isCA = useMemo(() => !!contracts[address], [contracts, address]);

  const elfBalance = useMemo(
    () => balances?.find(item => item.symbol === "ELF")?.balance,
    [balances]
  );

  const pageTitle = useMemo(() => {
    return isCA ? "Contract" : "Address";
  }, [isCA]);

  const handlePageChange = useCallback(
    (page, size) => {
      setPageNum(size === pageSize ? page : 1);
      setPageSize(size);
    },
    [pageSize]
  );

  const fetchBalances = useCallback(async () => {
    setTokensLoading(true);
    const result = await get(VIEWER_BALANCES, {
      address,
    });
    if (result?.code === 0) {
      const { data } = result;
      setBalances(data);
      setTotal(data.length);
    } else {
      nav("/search-failed");
    }
  }, [address]);

  const tokenList = useMemo(() => {
    const prev = (pageNum - 1) * pageSize;
    const start = prev > 0 ? prev : 0;
    return balances.slice(start, pageNum * pageSize);
  }, [balances, pageNum, pageSize]);

  const fetchPrice = useCallback(async () => {
    if (balances?.length) {
      setPrices({});
      await Promise.allSettled(
        balances?.map(item => {
          const isFT = /^[a-z0-9]+$/i.test(item.symbol);
          if (!isFT) {
            return {};
          }
          return get(TOKEN_PRICE, { fsym: item.symbol, tsyms: "USD" });
        })
      ).then(res => {
        setTokensLoading(false);
        res.forEach(({ value: item }) => {
          if (item && item.USD) {
            setPrices(v => ({ ...v, [item.symbol]: item.USD }));
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
    if (isCA) {
      fetchFile();
      fetchHistory();
      if (!hash) {
        // token tab without hash
        setActiveKey(key || "tokens");
      } else {
        setActiveKey(key || "contract");
      }
    } else {
      setActiveKey(key || "tokens");
    }
  }, [isCA, fetchFile]);

  useEffectOnce(() => {
    getContractNames().then(res => setContracts(res));
  });

  useEffect(() => {
    const res = isAddress(address);
    if (!res) {
      nav(`/search-invalid/${address}`);
    }
  }, [address]);

  const changeTab = key => {
    if (key === "tokens") {
      removeHash();
      setActiveKey("tokens");
    } else {
      const index = Object.values(keyFromHash).findIndex(ele => ele === key);
      window.location.hash = Object.keys(keyFromHash)[index];
    }
  };

  window.addEventListener("hashchange", () => {
    const { hash } = window.location;
    const key = keyFromHash[hash];
    if (isCA && hash) {
      setActiveKey(key || "contract");
    } else {
      setActiveKey(key || "tokens");
    }
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
            getPopupContainer={node => node}
            trigger="click"
            title={<QrCode value={`${addressFormat(address)}`} />}
          >
            <IconFont type="code" />
          </Tooltip>
          <a
            className="view-on-v2"
            target="_blank"
            href={`${
              EXPLORER_V2_LINK[NETWORK_TYPE]
            }${CHAIN_ID}/address/${addressFormat(address)}`}
            rel="noreferrer"
          >
            View the address on aelfscan
          </a>
        </p>
      </section>
      <Overview prices={prices} elfBalance={elfBalance} />
      <section className="more-info">
        <Tabs activeKey={activeKey} onTabClick={key => changeTab(key)}>
          {CommonTabPane({
            balances: tokenList,
            prices,
            tokensLoading,
            address,
            tokenPagination: {
              pageNum,
              pageSize,
              total,
              handlePageChange,
            },
          }).map(({ children, ...props }) => (
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
              onTabClick: key => {
                setActiveKey(key);
              },
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
