/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 20:06:58
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-03 17:24:22
 * @Description: the paths to the request module
 */
import { RequestWithParams } from './server';

const BASE_API = '/api'; // server local
const SERVER_BASE_API = 'http://192.168.10.179:8001/api'; // server

const Block_API_List = {
  getBlockList: `${BASE_API}/app/blockchain/blocks`,
  getServerBlockList: `${SERVER_BASE_API}/app/blockchain/blocks`,
  getBlockDetail: `${BASE_API}/app/blockchain/blockDetail`,
  getServerBlockDetail: `${SERVER_BASE_API}/app/blockchain/blockDetail`,
  query: 'https://dummyjson.com/products/search',
};

const Transaction_API_List = {
  getTransaction: '',
  getTransactionDetail: `${BASE_API}/app/blockchain/transactionDetail?chainId=tDVW&blockHeight=114844339&transactionId=412a0b59572e9c4056b308e6d5b584d649ecb2415580f29f466f62a2c784f24b`,
};

const Common_API_List = {
  getPrice: '',
};

const CMS_API_List = {
  getGlobalConfig: `${process.env.NEXT_PUBLIC_CMS_URL}/items/globalConfig?fields%5B%5D=*&fields%5B%5D=networkList.network_id.*&deep%5BnetworkList%5D%5B_sort%5D=-network_id.index&fields%5B%5D=headerMenuList.headerMenu_id.*&fields%5B%5D=headerMenuList.headerMenu_id.children.*&deep%5BheaderMenuList%5D%5B_sort%5D=-headerMenu_id.index&deep%5BheaderMenuList%5D%5BheaderMenu_id%5D%5Bchildren%5D%5B_sort%5D=-index&fields%5B%5D=footerMenuList.footerMenu_id.*&fields%5B%5D=footerMenuList.footerMenu_id.children.*&deep%5BfooterMenuList%5D%5B_sort%5D=-footerMenu_id.index&deep%5BfooterMenuList%5D%5BfooterMenu_id%5D%5Bchildren%5D%5B_sort%5D=-index&fields%5B%5D=chainList.chainList_id.*&deep%5BchainList%5D%5B_sort%5D=-chainList_id.index`,
};

export const Socket_API_List = {
  overview: '/signalr-hubs/overview',
};

export const API_List = {
  block: Block_API_List,
  tx: Transaction_API_List,
  common: Common_API_List,
  cms: CMS_API_List,
};

type REQUEST_FUNCTION = (opt?: RequestWithParams) => Promise<any>;

export type REQUEST_API_TYPE = {
  [X in keyof typeof API_List]: {
    [Y in keyof (typeof API_List)[X]]: REQUEST_FUNCTION;
  };
};
