import withNoSSR from 'utils/withNoSSR';
import Home from 'page-components/Home';
// export default withNoSSR(Home);
export default Home;

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
import { CHAIN_ID } from 'constants/config/config';
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

const fetch = async (url: string) => {
  const res = await getSSR(url, {
    page: 0,
    limit: PAGE_SIZE,
    order: 'desc',
  });
  return res;
};
const getPrice = async (ctx) => {
  const isMobile = isPhoneCheckSSR(ctx);
  if (CHAIN_ID === 'AELF' && isMobile) {
    mobilePrice = (await getSSR(ELF_REALTIME_PRICE_URL, {}, { onlyUrl: true })) as PriceDto;
    mobilePrevPrice = (await getSSR(HISTORY_PRICE, {
      token_id: 'aelf',
      vs_currencies: 'usd',
      date: new Date(new Date().toLocaleDateString()).valueOf() - 24 * 3600 * 1000,
    })) as PreviousPriceDto;
  }
};
const initBasicInfo = async () => {
  const {
    height = 0,
    totalTxs,
    unconfirmedBlockHeight = '0',
    accountNumber = 0,
  } = (await getSSR(BASIC_INFO)) as BasicInfo;
  blockHeight = height;
  localTransactionsSSR = totalTxs;
  unconfirmedBlockHeightSSR = unconfirmedBlockHeight;
  localAccountsSSR = accountNumber;
};
const initBlock = async () => {
  const blocksData: BlocksResult = (await fetch(ALL_BLOCKS_API_URL)) as BlocksResult;
  blocksSSR = blocksData.blocks;
};
const initTxs = async () => {
  const TXSData: TXSResultDto = (await fetch(ALL_TXS_API_URL)) as TXSResultDto;
  transactionsSSR = TXSData.transactions;
  localTransactionsSSR = TXSData.total;
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
const initSocketSSR = async () => {
  return new Promise((resolve) => {
    //todo: change to location.origin
    const socket = io('https://explorer-test.aelf.io', {
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
export async function getServerSideProps(ctx) {
  await Promise.all([getPrice(ctx), initBasicInfo(), initBlock(), initTxs()]);

  const { data, isFirst } = (await initSocketSSR()) as any;
  handleSocketData(data, isFirst);
  const tpsData = await getSSR(TPS_LIST_API_URL, {
    start: startTime,
    end: endTime,
    interval: interval,
  });
  return {
    props: {
      mobilePrice,
      mobilePrevPrice,
      tpsData,
      blockHeight,
      rewardSSR,
      localAccountsSSR,
      unconfirmedBlockHeightSSR,
      localTransactionsSSR,
      transactionsSSR,
      blocksSSR,
    },
  };
}
