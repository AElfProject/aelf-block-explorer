const Contracts = dynamic(import('page-components/Contracts/index'));
import { NextPageContext } from 'next';
import { getSSR } from 'utils/axios';
import { VIEWER_CONTRACTS_LIST } from 'constants/viewerApi';
import dynamic from 'next/dynamic';

const fetchContractList = async (ctx) => {
  const result = await getSSR(ctx, VIEWER_CONTRACTS_LIST, {
    pageSize: 50,
    pageNum: 1,
  });
  if (result.code === 0) {
    return result.data;
  }
};
export const getServerSideProps = async (ctx: NextPageContext) => {
  const headers = ctx.req?.headers;
  const { total: actualTotal = 0, list: dataSource = [] } = await fetchContractList(ctx);
  return {
    props: {
      headers,
      actualtotalssr: actualTotal,
      datasourcessr: dataSource,
    },
  };
};
export default Contracts;
