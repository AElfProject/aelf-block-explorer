import { NextPageContext } from 'next';
import { getSSR } from 'utils/axios';
import { getTokenAllInfo } from 'utils/utils';
import { TOKEN_PRICE } from 'constants/viewerApi';
import { VIEWER_TOKEN_TX_LIST } from 'constants/viewerApi';
import TokenDetail from 'page-components/TokenDetail/index';

interface IResult {
  status: string;
  value?: any;
  reason?: string;
}
let redirectRes;
// get token info for overview
const fetchTokenInfo = async (ctx, symbol) => {
  const result = await getTokenAllInfo(symbol, ctx).catch(() => {
    redirectRes = '/search-failed';
    return;
  });
  if (result?.symbol === symbol) {
    return result;
  } else {
    redirectRes = `/search-invalid/${symbol}`;
  }
};
const fetchPrice = async (ctx, symbol) => {
  const result = await getSSR(ctx, TOKEN_PRICE, { fsym: symbol, tsyms: 'USD' });
  if (result?.symbol === symbol) {
    const { USD } = result;
    return USD;
  } else {
    return 0;
  }
};
const fetchTransactions = async (ctx, symbol) => {
  const result = await getSSR(ctx, VIEWER_TOKEN_TX_LIST, {
    symbol,
    pageSize: 50,
    pageNum: 1,
  });
  if (result.code === 0) {
    const data = result.data.list.map((item) => ({
      ...item,
      tx_id: item.txId,
      block_height: item.blockHeight,
      address_from: item.addressFrom,
      address_to: item.addressTo,
      tx_fee: JSON.stringify(item.txFee),
    }));
    const total = result.data.total;
    return {
      data,
      total,
    };
  } else {
    // ground result
    return {
      data: null,
      total: 0,
    };
  }
};
export const getServerSideProps = async (ctx: NextPageContext) => {
  const headers = ctx.req?.headers;
  const { symbol } = ctx.query;
  let tokenInfo, price, dataSource, actualTotal;
  await Promise.allSettled([fetchTokenInfo(ctx, symbol), fetchPrice(ctx, symbol), fetchTransactions(ctx, symbol)]).then(
    (result: IResult[]) => {
      tokenInfo = result[0].value;
      price = result[1].value;
      dataSource = result[2].value.data;
      actualTotal = result[2].value.total;
      // if rejected, don't throw error just request in client
    },
  );

  if (redirectRes) {
    return {
      redirect: {
        permanent: false,
        destination: redirectRes,
      },
    };
  }

  return {
    props: {
      tokeninfossr: tokenInfo,
      pricessr: price,
      datasourcessr: dataSource,
      actual_total_ssr: actualTotal,
      headers,
    },
  };
};

export default TokenDetail;
