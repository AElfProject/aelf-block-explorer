import AddressDetail from 'page-components/AddressDetail/index';
import { NextPageContext } from 'next';
import { getSSR } from 'utils/axios';
import { TOKEN_PRICE, VIEWER_BALANCES, VIEWER_GET_FILE, VIEWER_HISTORY } from 'constants/viewerApi';
import { IBalance } from 'page-components/AddressDetail/types';
import { isAddress, getContractNames } from 'utils/utils';
let redirectRes;
const fetchBalances = async (ctx, address) => {
  const result = await getSSR(ctx, VIEWER_BALANCES, { address });
  if (result?.code === 0) {
    const { data } = result;
    return data;
  } else {
    redirectRes = '/search-failed';
  }
};
const fetchPrice = async (ctx, balances) => {
  let prices = {};
  if (balances.length) {
    const res: any = await Promise.allSettled(
      balances.map((item: IBalance) => getSSR(ctx, TOKEN_PRICE, { fsym: item.symbol, tsyms: 'USD' })),
    );

    res.forEach(({ value: item }) => {
      if (item && item.USD) {
        prices = { ...prices, [item.symbol]: item.USD };
      }
    });
  }
  return prices;
};
const fetchHistory = async (ctx, address) => {
  const result = await getSSR(ctx, VIEWER_HISTORY, { address });
  if (result?.code === 0) {
    const { data } = result;
    return data;
  } else {
    redirectRes = '/search-failed';
  }
};
const fetchFile = async (ctx, address, codeHash) => {
  const result = await getSSR(ctx, VIEWER_GET_FILE, { address, codeHash });
  if (result?.code === 0) {
    const { data } = result;
    return data;
  } else {
    redirectRes = '/search-failed';
  }
};
const fetchIsAddress = (address) => {
  const res = isAddress(address);
  if (!res) {
    redirectRes = `/search-invalid/${address}`;
  }
};
export const getServerSideProps = async (ctx: NextPageContext) => {
  const headers = ctx.req?.headers;
  const { address, codeHash } = ctx.query as { address: string; codeHash: string };
  fetchIsAddress(address);
  // get all contracts
  const contracts = await getContractNames(ctx);
  // judge if contract or address
  const isCA = !!contracts[address as string];
  const balances = await fetchBalances(ctx, address);
  const prices = (await fetchPrice(ctx, balances)) || {};
  let contractHistory = null;
  let contractInfo = null;
  if (isCA) {
    contractInfo = await fetchFile(ctx, address, codeHash);
    contractHistory = await fetchHistory(ctx, address);
  }
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
      balancesssr: balances,
      pricesssr: prices,
      contractinfossr: JSON.parse(JSON.stringify(contractInfo)),
      contracthistoryssr: JSON.parse(JSON.stringify(contractHistory)),
      headers,
    },
  };
};

export default AddressDetail;
