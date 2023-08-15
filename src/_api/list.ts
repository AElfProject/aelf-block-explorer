/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 20:06:58
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-03 17:24:22
 * @Description: the paths to the request module
 */
import { RequestWithParams } from './server';

const Block_API_List = {
  getBlockList: 'https://dummyjson.com/products',
  query: 'https://dummyjson.com/products/search',
};

const Transaction_API_List = {
  getTransaction: '',
};

const Common_API_List = {
  getPrice: '',
};
export const Socket_API_List = {
  overview: '/signalr-hubs/overview',
};

export const API_List = {
  block: Block_API_List,
  tx: Transaction_API_List,
  common: Common_API_List,
};

type REQUEST_FUNCTION = (opt?: RequestWithParams) => Promise<any>;

export type REQUEST_API_TYPE = {
  [X in keyof typeof API_List]: {
    [Y in keyof (typeof API_List)[X]]: REQUEST_FUNCTION;
  };
};
