import React, { useEffect, useState, useCallback, useMemo } from 'react';
import TPSChart from '../../components/TPSChart/TPSChart';
import {
  ALL_BLOCKS_API_URL,
  ALL_TXS_API_URL,
  BASIC_INFO,
  ELF_REALTIME_PRICE_URL,
  HISTORY_PRICE,
} from '../../constants';
import { get, transactionFormat } from 'utils/axios';
import ChainInfo from './components/ChainInfo';
import LatestInfo from './components/LatestInfo';
import Search from './components/Search';
import TokenIcon from '../../assets/images/tokenLogo.png';
import { initSocket } from './socket';
import {
  IBasicInfo,
  IBlocksResult,
  IBlockItem,
  ITXSResultDto,
  ITXItem,
  IFormatBlockDto,
  ISocketTxItem,
  ISocketData,
  IHomeProps,
} from './types';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';
import config, { NETWORK_TYPE } from 'constants/config/config';
import Image from 'next/image';
import BannerPc from 'assets/images/banner_pc.png';
import BannerMobile from 'assets/images/banner_mobile.png';
import { getNodesInfo } from 'utils/getNodesInfo';
require('./Home.styles.less');

const PAGE_SIZE = 25;

export default function Home({
  mobileprice: mobilePrice,
  mobileprevprice: mobilePrevPrice,
  tpsdata: tpsData,
  blockheight: blockHeight,
  rewardssr: rewardSSR,
  localaccountsssr: localAccountsSSR,
  unconfirmedblockheightssr: unconfirmedBlockHeightSSR,
  localtransactionsssr: localTransactionsSSR,
  transactionsssr: transactionsSSR,
  blocksssr: blocksSSR,
  headers,
}: IHomeProps) {
  const { CHAIN_ID } = config;
  const [price, setPrice] = useState(mobilePrice || { USD: 0 });
  const [previousPrice, setPreviousPrice] = useState(mobilePrevPrice || { usd: 0 });
  const [blocks, setBlocks] = useState<IBlockItem[]>(blocksSSR || []);
  const [transactions, setTransactions] = useState<ITXItem[]>(transactionsSSR || []);
  const [reward, setReward] = useState(rewardSSR || { ELF: 0 });
  // type of BasicInfo.totalTxs not equal to TXSResultDto.total
  const [localTransactions, setLocalTransactions] = useState(localTransactionsSSR || 0);
  const [localAccounts, setLocalAccounts] = useState(localAccountsSSR || 0);
  const [unconfirmedBlockHeight, setUnconfirmedBlockHeight] = useState(unconfirmedBlockHeightSSR || '0');
  const [isMobile, setIsMobile] = useState(!!isPhoneCheckSSR(headers));

  const latestSection = useMemo(
    () => <LatestInfo blocks={blocks} transactions={transactions} headers={headers} />,
    [blocks, transactions],
  );
  blockHeight = blockHeight || 0;
  const range = useMemo(() => {
    if (price.USD && previousPrice.usd) {
      return ((price.USD - previousPrice.usd) / previousPrice.usd) * 100;
    }
    return 0;
  }, [price.USD, previousPrice.usd]);
  useEffect(() => {
    setIsMobile(!!isPhoneCheck());
  }, []);
  useEffect(() => {
    if (CHAIN_ID === 'AELF' && NETWORK_TYPE === 'MAIN' && isMobile) {
      get(ELF_REALTIME_PRICE_URL).then((price: any) => setPrice(price));
      get(HISTORY_PRICE, {
        token_id: 'aelf',
        vs_currencies: 'usd',
        date: new Date(new Date().toLocaleDateString()).valueOf() - 24 * 3600 * 1000,
      }).then((res: any) => {
        if (!res.message) {
          setPreviousPrice(res);
        }
      });
    }
  }, [isMobile]);

  // csr only
  useEffect(() => {
    const socket = initSocket(handleSocketData);
    initBasicInfo();
    initBlock();
    initTxs();
    return () => {
      socket.close();
    };
  }, [initSocket]);

  const fetch = useCallback(async (url: string) => {
    const res = await get(url, {
      page: 0,
      limit: PAGE_SIZE,
      order: 'desc',
    });

    return res;
  }, []);

  const initBasicInfo = useCallback(async () => {
    const result: IBasicInfo = (await get(BASIC_INFO)) as IBasicInfo;

    const { height = 0, totalTxs, unconfirmedBlockHeight = '0', accountNumber = 0 } = result;
    blockHeight = height;
    setLocalTransactions(totalTxs);
    setUnconfirmedBlockHeight(unconfirmedBlockHeight);
    setLocalAccounts(accountNumber);
  }, []);

  const initBlock = useCallback(async () => {
    const blocksResult: IBlocksResult = (await fetch(ALL_BLOCKS_API_URL)) as IBlocksResult;
    const blocks = blocksResult.blocks;
    setBlocks(blocks);
  }, []);

  const initTxs = useCallback(async () => {
    const TXSResult: ITXSResultDto = (await fetch(ALL_TXS_API_URL)) as ITXSResultDto;
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
        unconfirmedBlockHeight: unconfirmedHeight = '0',
        accountNumber = 0,
        dividends,
      }: ISocketData,
      isFirst: boolean,
    ) => {
      let arr = list;
      if (!isFirst) {
        arr = list.filter((item) => {
          return item.block.Header.Height > blockHeight;
        });
      }
      arr.sort((pre, next) => next.block.Header.Height - pre.block.Header.Height);
      const new_transactions = arr.reduce((acc: ISocketTxItem[], i) => acc.concat(i.txs), []).map(transactionFormat);
      const new_blocks = arr.map((item) => formatBlock(item.block));
      blockHeight = height;
      setUnconfirmedBlockHeight(unconfirmedHeight);
      setTransactions((v) => {
        const temp: ITXItem = Object.fromEntries([...new_transactions, ...v].map((item) => [item.tx_id, item]));
        return Object.entries(temp)
          .map((item) => item[1])
          .sort((a, b) => b.block_height - a.block_height)
          .slice(0, 25) as ITXItem[];
      });
      setBlocks((v) => {
        const temp = Object.fromEntries([...new_blocks, ...v].map((item) => [item.block_height, item]));
        return Object.entries(temp)
          .map((item) => item[1])
          .sort((a, b) => b.block_height - a.block_height)
          .slice(0, 25) as IBlockItem[];
      });
      setLocalAccounts(accountNumber);
      setLocalTransactions(totalTxs);
      setReward(typeof dividends === 'string' ? JSON.parse(dividends) : dividends || {});
    },
    [],
  );

  const formatBlock = useCallback((block: IFormatBlockDto) => {
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
    <div className={'home-container basic-container-new ' + (isMobile ? 'mobile' : '')}>
      <div className="banner-section">
        {isMobile ? (
          <Image
            src={BannerMobile}
            layout="fill"
            objectFit="contain"
            objectPosition={'0 top'}
            priority
            alt="Picture of the banner mobile"></Image>
        ) : (
          <Image src={BannerPc} layout="fill" objectFit="contain" priority alt="Picture of the banner"></Image>
        )}
        <h2>AELF Explorer</h2>
        <Search />
        {CHAIN_ID === 'AELF' && NETWORK_TYPE === 'MAIN' && isMobile && (
          <div className="price-info">
            <img src={TokenIcon} />
            <span className="price">$ {price.USD}</span>
            <span className={'range ' + (range >= 0 ? 'rise' : 'fall')}>
              {range >= 0 ? '+' : ''}
              {range.toFixed(2)}%
            </span>
          </div>
        )}
      </div>
      <div className="body-container">
        <div className="info-section">
          <ChainInfo
            blockHeight={blockHeight}
            localTransactions={localTransactions}
            reward={reward}
            unconfirmedBlockHeight={unconfirmedBlockHeight}
            localAccounts={localAccounts}
          />
        </div>
        <div className="latest-section">{latestSection}</div>
        <div className="chart-section">
          <h3>Transactions Per Minute</h3>
          <TPSChart own={tpsData?.own} all={tpsData?.all} />
        </div>
      </div>
    </div>
  );
}
