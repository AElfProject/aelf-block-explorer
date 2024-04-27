import request from '@_api';
import { IBlocksDetailData, IBlocksDetailRequestParams, IBlocksRequestParams, TChainID } from './type';

const defaultTokenList = {
  total: 0,
  blocks: [],
};

export async function fetchBlocks(params: IBlocksRequestParams) {
  const result = await request.block.getBlockList({
    params: params,
  });
  const data = result?.data || defaultTokenList;
  return data;
}

export async function fetchLatestBlocksList(params: { chainId: TChainID }) {
  const result = await request.block.getLatestBlocksList({
    params: params,
  });
  const data = result?.data || defaultTokenList;
  return data;
}

export async function fetchServerBlocks(params: IBlocksRequestParams) {
  const result = await request.block.getServerBlockList({
    params: params,
  });
  const data = result?.data || defaultTokenList;
  return data;
}

export async function fetchServerBlocksDetail(params: IBlocksDetailRequestParams): Promise<IBlocksDetailData> {
  const result = await request.block.getServerBlockDetail({
    params: params,
  });
  const data = result?.data;
  return data;
}

export async function fetchBlocksDetail(params: IBlocksDetailRequestParams): Promise<IBlocksDetailData> {
  const result = await request.block.getBlockDetail({
    params: params,
  });
  const data = result?.data || {};
  return data;
}
