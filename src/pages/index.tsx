const Home = dynamic(import('page-components/Home'));
export default Home;
import { NextPageContext } from 'next';
import {
  IBasicInfo,
  IBlocksResult,
  IBlockItem,
  ITXSResultDto,
  ITXItem,
  IFormatBlockDto,
  ISocketTxItem,
  ISocketData,
  IPriceDto,
  IPreviousPriceDto,
  IRewardDto,
  ITpsDataDto,
} from 'page-components/Home/types';
import config from 'constants/config/config';
import { SOCKET_URL } from 'constants/index';
import { isPhoneCheckSSR } from 'utils/deviceCheck';
import { getSSR, transactionFormat } from 'utils/axios';
import {
  TPS_LIST_API_URL,
  ALL_BLOCKS_API_URL,
  ALL_TXS_API_URL,
  BASIC_INFO,
  ELF_REALTIME_PRICE_URL,
  HISTORY_PRICE,
} from 'constants/api';
import io from 'socket.io-client';
import dynamic from 'next/dynamic';
import { fetchWithCache } from 'utils/fetchWithCache';

let chainId = config.CHAIN_ID;
const PAGE_SIZE = 25;
const interval = 60 * 1000; // 1 minute
const delay = 5 * 60 * 1000; // 5 minute
const endTime = new Date().getTime() - delay;
const startTime = endTime - 60 * 60 * 3 * 1000;
let mobilePrice: IPriceDto = { USD: 0 },
  mobilePrevPrice: IPreviousPriceDto = { usd: 0 },
  blockHeight = 0,
  rewardSSR: IRewardDto = { ELF: 0 },
  localAccountsSSR = 0,
  unconfirmedBlockHeightSSR = '0',
  localTransactionsSSR = 0,
  transactionsSSR: ITXItem[] = [],
  blocksSSR: IBlockItem[] = [];

const fetch = async (ctx: NextPageContext, url: string) => {
  const res = await getSSR(ctx, url, {
    page: 0,
    limit: PAGE_SIZE,
    order: 'desc',
  });
  return res;
};
const getPrice = async (ctx: NextPageContext) => {
  try {
    const isMobile = isPhoneCheckSSR(ctx.req?.headers);
    if (chainId === 'AELF' && isMobile) {
      mobilePrice = (await getSSR(ctx, ELF_REALTIME_PRICE_URL, {}, { onlyUrl: true })) as IPriceDto;
      mobilePrevPrice = (await getSSR(ctx, HISTORY_PRICE, {
        token_id: 'aelf',
        vs_currencies: 'usd',
        date: new Date(new Date().toLocaleDateString()).valueOf() - 24 * 3600 * 1000,
      })) as IPreviousPriceDto;
    }
  } catch (e) {
    // todo: unify error handle
    mobilePrice = { USD: 0 };
    mobilePrevPrice = { usd: 0 };
  }
};
const initBasicInfo = async (ctx: NextPageContext) => {
  try {
    const {
      height = 0,
      totalTxs,
      unconfirmedBlockHeight = '0',
      accountNumber = 0,
    } = (await getSSR(ctx, BASIC_INFO)) as IBasicInfo;
    blockHeight = height;
    localTransactionsSSR = totalTxs;
    unconfirmedBlockHeightSSR = unconfirmedBlockHeight;
    localAccountsSSR = accountNumber;
  } catch (e) {
    blockHeight = 0;
    localTransactionsSSR = 0;
    unconfirmedBlockHeightSSR = '0';
    localAccountsSSR = 0;
  }
};
const initBlock = async (ctx: NextPageContext) => {
  try {
    const blocksData: IBlocksResult = (await fetch(ctx, ALL_BLOCKS_API_URL)) as IBlocksResult;
    blocksSSR = blocksData.blocks;
  } catch (e) {
    blocksSSR = [];
  }
};
const initTxs = async (ctx: NextPageContext) => {
  try {
    const TXSData: ITXSResultDto = (await fetch(ctx, ALL_TXS_API_URL)) as ITXSResultDto;
    transactionsSSR = TXSData.transactions;
    localTransactionsSSR = TXSData.total;
  } catch (e) {
    transactionsSSR = [];
    localTransactionsSSR = 0;
  }
};
const formatBlock = (block: IFormatBlockDto) => {
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
};

const handleSocketData = (
  {
    list = [],
    height = 0,
    totalTxs,
    unconfirmedBlockHeight: unconfirmedHeight = '0',
    accountNumber = 0,
    dividends,
  }: ISocketData,
  isFirst?: boolean,
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
  unconfirmedBlockHeightSSR = unconfirmedHeight;
  transactionsSSR = (function (v) {
    const temp: ITXItem = Object.fromEntries([...new_transactions, ...v].map((item) => [item.tx_id, item]));
    return Object.entries(temp)
      .map((item) => item[1])
      .sort((a, b) => b.block_height - a.block_height)
      .slice(0, 25) as ITXItem[];
  })(transactionsSSR);
  blocksSSR = (function (v) {
    const temp = Object.fromEntries([...new_blocks, ...v].map((item) => [item.block_height, item]));
    return Object.entries(temp)
      .map((item) => item[1])
      .sort((a, b) => b.block_height - a.block_height)
      .slice(0, 25) as IBlockItem[];
  })(blocksSSR);
  localAccountsSSR = accountNumber;
  localTransactionsSSR = totalTxs;
  rewardSSR = typeof dividends === 'string' ? JSON.parse(dividends) : dividends || {};
};
// init socket from server side
const initSocketSSR = async () => {
  return new Promise((resolve, reject) => {
    // use test host which is set in .env.local when in local env
    const BUILD_ENDPOINT_HOST = process.env.BUILD_ENDPOINT_HOST;

    const socket = io(BUILD_ENDPOINT_HOST, {
      path: SOCKET_URL,
      transports: ['websocket', 'polling'],
      // set timeout 1.5s
      timeout: '1500',
    });
    socket.on('reconnect_attempt', () => {
      socket.io.opts.transports = ['polling', 'websocket'];
    });
    socket.on('connection', (data: any) => {
      if (data !== 'success') {
        throw new Error("can't connect to socket");
      }
    });
    let isFirst = true;
    socket.on('getBlocksList', (data: ISocketData) => {
      if (isFirst) {
        isFirst = false;
        resolve({ data, isFirst: true });
      } else {
        resolve({ data });
      }
    });
    socket.emit('getBlocksList');
    socket.io.on('reconnect_failed', () => {
      console.log('timeout');
      reject();
    });
  });
};
export const getServerSideProps = async (ctx: NextPageContext) => {
  // get chain info config
  const headers = ctx.req?.headers;
  chainId = config.CHAIN_ID;
  let tpsData;
  // fetch interface
  await Promise.all([getPrice(ctx), initBasicInfo(ctx), initBlock(ctx), initTxs(ctx)]);
  try {
    const { data, isFirst } = await fetchWithCache(ctx, 'socketData', initSocketSSR);
    handleSocketData(data, isFirst);
  } catch {
    // error handle
  }

  try {
    tpsData = (await getSSR(ctx, TPS_LIST_API_URL, {
      start: startTime,
      end: endTime,
      interval: interval,
    })) as ITpsDataDto;
  } catch (e) {
    tpsData = {
      own: [],
      all: [],
    };
  }
  return {
    props: {
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
    },
  };
};
