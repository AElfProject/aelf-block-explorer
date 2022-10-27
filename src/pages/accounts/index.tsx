const Accounts = dynamic(import('page-components/Accounts/index'));
import { NextPageContext } from 'next';
import { VIEWER_ACCOUNT_LIST } from 'constants/viewerApi';
import { getSSR } from 'utils/axios';
import { defaultAElfInstance, getContract } from 'utils/utils';
import { getContractAddress } from 'page-components/Proposal/common/utils';
import dynamic from 'next/dynamic';

const fetchAccountList = async (ctx: NextPageContext) => {
  const result = await getSSR(ctx, VIEWER_ACCOUNT_LIST, {
    pageSize: 50,
    pageNum: 1,
    symbol: 'ELF',
  });
  if (result?.code === 0) {
    const { data } = result;
    return data;
  } else {
    return {};
  }
};
const fetchData = async () => {
  try {
    const token = await getContract(defaultAElfInstance, getContractAddress('Token'));
    const result = await token.GetTokenInfo.call({
      symbol: 'ELF',
    });
    return result;
  } catch (e) {
    console.error('error', e);
    return {};
  }
};
export const getServerSideProps = async (ctx: NextPageContext) => {
  const headers = ctx.req?.headers;
  const { supply: totalELF = 0 } = await fetchData();
  const { list: dataSource, total: actualTotal = 0 } = await fetchAccountList(ctx);
  return {
    props: {
      totalelfssr: totalELF,
      datasourcessr: dataSource,
      actualtotalssr: actualTotal,
      headers,
    },
  };
};
export default Accounts;
