import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import TPSChart from "../../components/TPSChart/TPSChart";
import {
  ALL_BLOCKS_API_URL,
  ALL_TXS_API_URL,
  BASIC_INFO,
  ELF_REALTIME_PRICE_URL,
} from "../../constants";
import { get } from "../../utils";
import ChainInfo from "./components/ChainInfo";
import LatestInfo from "./components/LatestInfo";
import Search from "./components/Search";
import useMobile from "../../hooks/useMobile";

const PAGE_SIZE = 25;

const TokenIcon = require("../../assets/images/tokenLogo.png");

import "./home.styles.less";
import { initSocket } from "./socket";
import { useEffectOnce } from "react-use";
export default function Home() {
  const [price, setPrice] = useState({ USD: 0 });
  const [blocks, setBlocks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [blockHeight, setBlockHeight] = useState(0);
  const [reward, setReward] = useState({ ELF: 0 });
  const [localTransactions, setLocalTransactions] = useState(0);
  const [localAccounts, setLocalAccounts] = useState(0);
  const [unconfirmedBlockHeight, setUnconfirmedBlockHeight] = useState(0);
  const isMobile = useMobile();

  const latestSection = useMemo(
    () => <LatestInfo blocks={blocks} transactions={transactions} />,
    [blocks, transactions]
  );

  useEffectOnce(() => {
    get(ELF_REALTIME_PRICE_URL).then((price) => setPrice(price));
  });

  useEffect(() => {
    const socket = initSocket(handleSocketData);
    initBasicInfo();
    initBlock();
    initTxs();
    return () => {
      socket.close();
    };
  }, [initSocket]);

  const fetch = useCallback(async (url) => {
    const res = await get(url, {
      page: 0,
      limit: PAGE_SIZE,
      order: "desc",
    });

    return res;
  }, []);

  const initBasicInfo = useCallback(async () => {
    const result = await get(BASIC_INFO);

    const {
      height = 0,
      totalTxs,
      unconfirmedBlockHeight = 0,
      accountNumber = 0,
    } = result;
    setBlockHeight(height);
    setLocalTransactions(totalTxs);
    setUnconfirmedBlockHeight(unconfirmedBlockHeight);
    setLocalAccounts(accountNumber);
  }, []);

  const initBlock = useCallback(async () => {
    const blocksResult = await fetch(ALL_BLOCKS_API_URL);
    const blocks = blocksResult.blocks;
    setBlocks(blocks);
  }, []);

  const initTxs = useCallback(async () => {
    const TXSResult = await fetch(ALL_TXS_API_URL);
    const transactions = TXSResult.transactions;
    const totalTransactions = TXSResult.total;
    setTransactions(transactions);
    setLocalTransactions(totalTransactions);
  }, []);

  const handleSocketData = useCallback(
    (
      {
        list = [],
        height = 0,
        totalTxs,
        unconfirmedBlockHeight: unconfirmedHeight = 0,
        accountNumber = 0,
        dividends,
      },
      isFirst
    ) => {
      let arr = list;
      if (!isFirst) {
        arr = list.filter((item) => {
          return item.block.Header.Height > blockHeight;
        });
      }
      arr.sort(
        (pre, next) => next.block.Header.Height - pre.block.Header.Height
      );
      const new_transactions = arr
        .reduce((acc, i) => acc.concat(i.txs), [])
        .map(transactionFormat);
      const new_blocks = arr.map((item) => formatBlock(item.block));
      setBlockHeight(height);
      setUnconfirmedBlockHeight(unconfirmedHeight);
      setTransactions([...new_transactions, ...transactions].slice(0, 25));
      setBlocks([...new_blocks, ...blocks].slice(0, 25));
      setLocalAccounts(accountNumber);
      setLocalTransactions(totalTxs);
      setReward(JSON.parse(dividends));
    },
    [transactions, blocks]
  );

  const formatBlock = useCallback((block) => {
    const { BlockHash, Header, Body } = block;
    return {
      block_hash: BlockHash,
      block_height: +Header.Height,
      chain_id: Header.ChainId,
      merkle_root_state: Header.MerkleTreeRootOfWorldState,
      merkle_root_tx: Header.MerkleTreeRootOfTransactions,
      pre_block_hash: Header.PreviousBlockHash,
      time: Header.Time,
      tx_count: Body.TransactionsCount,
      dividends: block.dividend,
      miner: block.miner,
    };
  }, []);

  return (
    <div
      className={
        "home-container basic-container-new " + (isMobile ? "mobile" : "")
      }
    >
      <section className="banner-section">
        <h2>AELF Explorer</h2>
        <Search />
        {isMobile && (
          <div className="price-info">
            <img src={TokenIcon} />
            <span className="price">$ {price.USD}</span>
            {/* <span className="range">+12.1%</span> */}
          </div>
        )}
      </section>
      <div className="body-container">
        <section className="info-section">
          <ChainInfo
            blockHeight={blockHeight}
            localTransactions={localTransactions}
            reward={reward}
            unconfirmedBlockHeight={unconfirmedBlockHeight}
            localAccounts={localAccounts}
          />
        </section>
        <section className="latest-section">{latestSection}</section>
        <section className="chart-section">
          <h3>Transactions Per Minute</h3>
          <TPSChart />
        </section>
      </div>
    </div>
  );
}
