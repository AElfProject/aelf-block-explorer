import React, { useCallback, useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useParams } from "react-router";
import { Tabs, Tooltip } from "antd";
import { useEffectOnce } from "react-use";
import CopyButton from "../../components/CopyButton/CopyButton";
import IconFont from "../../components/IconFont";
import { CHAIN_ID } from "../../constants";
import QrCode from "./components/QrCode/QrCode";
import Tokens from "./components/Tokens/Tokens";
import { get, getContractNames } from "../../utils";
import { TOKEN_PRICE, VIEWER_BALANCES } from "../../api/url";

import "./AddressDetail.styles.less";
import Transactions from "./components/Transactions/Transactions";
import Transfers from "./components/Transfers/Transfers";
import useMobile from "../../hooks/useMobile";

export default function AddressDetail() {
  const { address } = useParams();
  const isMobile = useMobile();
  const [contracts, setContracts] = useState({});
  const [prices, setPrices] = useState({});
  const [balances, setBalances] = useState([]);
  const [tokensLoading, setTokensLoading] = useState(true);

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
    if (result.code === 0) {
      const { data } = result;
      setBalances(data);
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
        res.forEach(({ value: item }) => {
          console.log(">>>item", item);
          if (item && item.USD) {
            setPrices((v) => ({ ...v, [item.symbol]: item.USD }));
          }
        });
      });
      setTokensLoading(false);
    }
  }, [balances]);

  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  useEffect(() => {
    fetchPrice();
  }, [balances]);

  useEffectOnce(() => {
    getContractNames().then((res) => setContracts(res));
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
          {address}
          <CopyButton value={address} />
          <Tooltip
            placement={isMobile ? "bottomRight" : "bottom"}
            color="white"
            getPopupContainer={(node) => node}
            trigger="click"
            title={<QrCode value={`ELF_${address}_${CHAIN_ID}`} />}
          >
            <IconFont type="code" />
          </Tooltip>
        </p>
      </section>
      <section className="overview">
        <p>Overview</p>
        <div>
          <p>
            <span className="label">Balance</span>
            <span className="value">
              {elfBalance ? `${Number(elfBalance).toLocaleString()} ELF` : "-"}
            </span>
          </p>
          <p>
            <span className="label">Value in USD</span>
            <span className="value">
              {elfBalance && prices.ELF
                ? `$${(prices.ELF * elfBalance).toLocaleString()}(@ $${
                    prices.ELF
                  }/ELF)`
                : "-"}
            </span>
          </p>
        </div>
      </section>
      <section className="more-info">
        <Tabs>
          <Tabs.TabPane key="tokens" tab="Tokens">
            <Tokens
              balances={balances}
              prices={prices}
              dataLoading={tokensLoading}
            />
          </Tabs.TabPane>
          <Tabs.TabPane key="transactions" tab="Transactions">
            <Transactions address={address} />
          </Tabs.TabPane>
          <Tabs.TabPane key="transfers" tab="Transfers">
            <Transfers address={address} />
          </Tabs.TabPane>
        </Tabs>
      </section>
    </div>
  );
}
