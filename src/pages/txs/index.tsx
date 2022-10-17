import dynamic from 'next/dynamic';
import { NextPageContext } from 'next';
const Txs = dynamic(import('page-components/Txs/TransactionList'));
import { ALL_TXS_API_URL, ALL_UNCONFIRMED_TXS_API_URL, TXS_BLOCK_API_URL } from 'constants/api';
import { getSSR } from 'utils/axios';
import { getContractNames } from 'utils/utils';

const merge = (data = {}, contractNames) => {
  const { transactions = [] } = data;
  return (transactions || []).map((item) => ({
    ...item,
    contractName: contractNames[item.address_to],
  }));
};
export const getServerSideProps = async (ctx: NextPageContext) => {
  const headers = ctx.req?.headers;
  const url = ctx.req?.url || '';
  const search = url.indexOf('?') !== -1 ? url.substring(url.indexOf('?')) : undefined;
  if (search) {
    return {
      redirect: {
        permanent: false,
        destination: `/block/${search.slice(1)}?tab=txns`,
      },
    };
  }
  const api = url.indexOf('unconfirmed') === -1 ? ALL_TXS_API_URL : ALL_UNCONFIRMED_TXS_API_URL;
  const data = await getSSR(ctx, api, {
    order: 'desc',
    page: 0,
    limit: 50,
    block_hash: (search && search.slice(1)) || undefined,
  });
  console.log(data, 'data');
  const contractNames = await getContractNames();
  const actualTotal = data ? data.total || data.transactions.length : 0;
  const dataSource = merge(data, contractNames);
  return {
    props: {
      actualtotalssr: actualTotal,
      datasourcessr: JSON.parse(JSON.stringify(dataSource)),
      headers,
    },
  };
};
export default Txs;
