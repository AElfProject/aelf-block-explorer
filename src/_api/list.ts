/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 20:06:58
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 00:41:40
 * @Description: the paths to the request module
 */

const Block_API_List = {
  getBlockList: 'https://dummyjson.com/products',
  getBlockByHash: 'api/getBlockByHash',
};

const Transaction_API_List = {
  getTransaction: '',
};

export const API_List = {
  block: Block_API_List,
  tx: Transaction_API_List,
};

type REQUEST_FUNCTION = (opt?: Request) => Promise<any>;

export type REQUEST_API_TYPE = {
  [X in keyof typeof API_List]: {
    [Y in keyof (typeof API_List)[X]]: REQUEST_FUNCTION;
  };
};
