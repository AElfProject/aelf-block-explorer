import Home from 'page-components/Home';
export default Home;
import { NextPageContext } from 'next';
import {
  BasicInfo,
  BlocksResult,
  BlockItem,
  TXSResultDto,
  TXItem,
  FormatBlockDto,
  SocketTxItem,
  SocketData,
  PriceDto,
  PreviousPriceDto,
  RewardDto,
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
let chainId = config.CHAIN_ID;
const PAGE_SIZE = 25;
const interval = 60 * 1000; // 1 minute
const delay = 5 * 60 * 1000; // 5 minute
const endTime = new Date().getTime() - delay;
const startTime = endTime - 60 * 60 * 3 * 1000;
let mobilePrice: PriceDto = { USD: 0 },
  mobilePrevPrice: PreviousPriceDto = { usd: 0 },
  blockHeight = 0,
  rewardSSR: RewardDto = { ELF: 0 },
  localAccountsSSR = 0,
  unconfirmedBlockHeightSSR = '0',
  localTransactionsSSR = 0,
  transactionsSSR: TXItem[] = [],
  blocksSSR: BlockItem[] = [];

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
      mobilePrice = (await getSSR(ctx, ELF_REALTIME_PRICE_URL, {}, { onlyUrl: true })) as PriceDto;
      mobilePrevPrice = (await getSSR(ctx, HISTORY_PRICE, {
        token_id: 'aelf',
        vs_currencies: 'usd',
        date: new Date(new Date().toLocaleDateString()).valueOf() - 24 * 3600 * 1000,
      })) as PreviousPriceDto;
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
    } = (await getSSR(ctx, BASIC_INFO)) as BasicInfo;
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
    const blocksData: BlocksResult = (await fetch(ctx, ALL_BLOCKS_API_URL)) as BlocksResult;
    blocksSSR = blocksData.blocks;
  } catch (e) {
    blocksSSR = [];
  }
};
const initTxs = async (ctx: NextPageContext) => {
  try {
    const TXSData: TXSResultDto = (await fetch(ctx, ALL_TXS_API_URL)) as TXSResultDto;
    transactionsSSR = TXSData.transactions;
    localTransactionsSSR = TXSData.total;
  } catch (e) {
    transactionsSSR = [];
    localTransactionsSSR = 0;
  }
};
const formatBlock = (block: FormatBlockDto) => {
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
  }: SocketData,
  isFirst?: boolean,
) => {
  let arr = list;
  if (!isFirst) {
    arr = list.filter((item) => {
      return item.block.Header.Height > blockHeight;
    });
  }
  arr.sort((pre, next) => next.block.Header.Height - pre.block.Header.Height);
  const new_transactions = arr.reduce((acc: SocketTxItem[], i) => acc.concat(i.txs), []).map(transactionFormat);
  const new_blocks = arr.map((item) => formatBlock(item.block));
  blockHeight = height;
  unconfirmedBlockHeightSSR = unconfirmedHeight;
  transactionsSSR = (function (v) {
    const temp: TXItem = Object.fromEntries([...new_transactions, ...v].map((item) => [item.tx_id, item]));
    return Object.entries(temp)
      .map((item) => item[1])
      .sort((a, b) => b.block_height - a.block_height)
      .slice(0, 25) as TXItem[];
  })(transactionsSSR);
  blocksSSR = (function (v) {
    const temp = Object.fromEntries([...new_blocks, ...v].map((item) => [item.block_height, item]));
    return Object.entries(temp)
      .map((item) => item[1])
      .sort((a, b) => b.block_height - a.block_height)
      .slice(0, 25) as BlockItem[];
  })(blocksSSR);
  localAccountsSSR = accountNumber;
  localTransactionsSSR = totalTxs;
  rewardSSR = typeof dividends === 'string' ? JSON.parse(dividends) : dividends || {};
};
// init socket from server side
const initSocketSSR = async (ctx: NextPageContext) => {
  return new Promise((resolve) => {
    // use test host which is set in .env.local when in local env
    const BUILD_ENDPOINT = process.env.BUILD_ENDPOINT || ctx.req?.headers.host;
    const socket = io(BUILD_ENDPOINT, {
      path: SOCKET_URL,
      transports: ['websocket', 'polling'],
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
    socket.on('getBlocksList', (data: SocketData) => {
      if (isFirst) {
        isFirst = false;
        resolve({ data, isFirst: true });
      } else {
        resolve({ data });
      }
    });
    socket.emit('getBlocksList');
  });
};
export const getServerSideProps = async (ctx: NextPageContext) => {
  // get chain info config
  const headers = ctx.req?.headers;
  chainId = config.CHAIN_ID;
  // fetch interface
  await Promise.all([getPrice(ctx), initBasicInfo(ctx), initBlock(ctx), initTxs(ctx)]);
  const { data, isFirst } = (await initSocketSSR(ctx)) as any;
  handleSocketData(data, isFirst);
  const tpsData = await getSSR(ctx, TPS_LIST_API_URL, {
    start: startTime,
    end: endTime,
    interval: interval,
  });
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
