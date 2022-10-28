const TxsDetail = dynamic(import('page-components/TxsDetail/TransactionDetail'));
import { NextPageContext } from 'next';
import { aelf, getSSR } from 'utils/axios';
import { getContractNames, deserializeLog, getFee, removeAElfPrefix } from 'utils/utils';
import { IInfo } from 'page-components/TxsDetail/types';
import { ELF_REALTIME_PRICE_URL, VIEWER_GET_ALL_TOKENS } from 'constants/api';
import dynamic from 'next/dynamic';

let redirectRes, contractNameSSR;
const getLastHeight = async () => {
  return aelf.chain
    .getChainStatus()
    .then(({ LastIrreversibleBlockHeight }) => {
      return LastIrreversibleBlockHeight;
    })
    .catch((_) => {
      console.log(1);
      redirectRes = '/search-failed';
    });
};
const getInfoBackUp = async (transaction) => {
  const { BlockNumber } = transaction;
  const block = await aelf.chain.getBlockByHeight(BlockNumber, false).catch((_) => {
    console.log(2);
    redirectRes = '/search-failed';
    return;
  });
  const {
    Header: { Time },
  } = block;
  return {
    ...(await getFee(transaction)),
    time: Time,
  };
};
const getData = async (res) => {
  const names = await getContractNames().catch((_) => {
    console.log(3);
    redirectRes = '/search-failed';
    return;
  });
  const { isSystemContract, contractName } = names[res.Transaction.To] || {};
  const name = isSystemContract ? removeAElfPrefix(contractName) : contractName;
  contractNameSSR = name || res.Transaction.To;
  const backup = await getInfoBackUp(res);
  return { ...res, ...backup };
};
const getTxResult = async (id) => {
  return aelf.chain
    .getTxResult(id)
    .then((res) => {
      if (res.Status === 'NOTEXISTED') {
        redirectRes = '/search-invalid/' + res.TransactionId;
      } else {
        return getData(res);
      }
    })
    .catch((_) => {
      console.log(4);
      redirectRes = '/search-failed';
    });
};
const getParseLog = async (info: IInfo) => {
  const { Logs = [] } = info || {};
  const logs: any[] = [];
  if (Logs.length) {
    const arr = Logs.filter((item) => item.Name === 'Transferred');
    for (const item of arr) {
      const res = await deserializeLog(item);
      logs.push({ ...res, key: item.Name + item.Address });
    }
    return [...logs];
  } else {
    return [];
  }
};
// used in tokenTags
const getDecimal = async (ctx) => {
  const result = await getSSR(ctx, VIEWER_GET_ALL_TOKENS, {
    pageSize: 5000,
    pageNum: 1,
  });
  const { data = { list: [] } } = result;
  const { list } = data;
  return Object.fromEntries(list.map((item) => [item.symbol, item.decimals]));
};

const getTokenPrice = async (ctx) => {
  return getSSR(ctx, ELF_REALTIME_PRICE_URL, { fsym: 'ELF', tsyms: 'USD,BTC,CNY' }).then((res) => {
    return res;
  });
};

export const getServerSideProps = async (ctx: NextPageContext) => {
  const headers = ctx.req?.headers;
  const { id } = ctx.query;
  let lastHeight, info, tokenPrice, decimals;
  await Promise.allSettled([getLastHeight(), getTxResult(id), getTokenPrice(ctx)]).then((result: any) => {
    lastHeight = result[0].value;
    info = result[1].value;
    tokenPrice = result[2].value;
  });

  const parsedLogs = await getParseLog(info);
  if (info && parsedLogs) {
    decimals = await getDecimal(ctx);
  }
  if (redirectRes) {
    return {
      redirect: {
        permanent: false,
        destination: redirectRes,
      },
    };
  }

  // without JSON.parse and JSON.stringify
  // throw error that `SerializableError: Error serializing`
  return {
    props: {
      lastheightssr: lastHeight,
      infossr: JSON.parse(JSON.stringify(info)),
      parsedlogsssr: parsedLogs || [],
      contractnamessr: contractNameSSR,
      tokenpricessr: tokenPrice || { USD: 0 },
      decimalsssr: decimals || {},
      headers,
    },
  };
};
export default TxsDetail;
