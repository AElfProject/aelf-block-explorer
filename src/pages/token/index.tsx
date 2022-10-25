import { NextPageContext } from 'next';
import { getSSR } from 'utils/axios';
import { VIEWER_GET_ALL_TOKENS } from 'constants/api';
import Tokens from 'page-components/Tokens/Tokens';
const fetchData = async (ctx) => {
  const result = await getSSR(ctx, VIEWER_GET_ALL_TOKENS, {
    pageSize: 50,
    pageNum: 1,
  });
  if (result.code === 0) {
    return result.data;
  } else {
    return {};
  }
};
export const getServerSideProps = async (ctx: NextPageContext) => {
  const headers = ctx.req?.headers;
  const { list: dataSource, total: actualTotal = 0 } = await fetchData(ctx);
  return {
    props: {
      actualtotalssr: actualTotal,
      datasourcessr: dataSource,
      headers,
    },
  };
};

export default Tokens;
