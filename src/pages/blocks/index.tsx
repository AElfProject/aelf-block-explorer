const Blocks = dynamic(import('page-components/Blocks'));
import { NextPageContext } from 'next';
import { ALL_BLOCKS_API_URL, ALL_UNCONFIRMED_BLOCKS_API_URL } from 'constants/api';
import { getSSR } from 'utils/axios';
import { IBlocksResult } from 'page-components/Home/types';
import dynamic from 'next/dynamic';
export const getServerSideProps = async (ctx: NextPageContext) => {
  const headers = ctx.req?.headers;
  const url = ctx.req?.url || '';
  const api = url.indexOf('unconfirmed') === -1 ? ALL_BLOCKS_API_URL : ALL_UNCONFIRMED_BLOCKS_API_URL;
  const data: IBlocksResult = (await getSSR(ctx, api, {
    order: 'desc',
    page: 0,
    limit: 50,
  })) as IBlocksResult;
  const all = data ? data.total : 0;
  const dataSource = data && data.blocks.length ? data.blocks : null;

  return {
    props: {
      allssr: all,
      datasourcessr: dataSource,
      headers,
    },
  };
};

export default Blocks;
