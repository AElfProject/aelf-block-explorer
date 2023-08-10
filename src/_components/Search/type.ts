/*
 * @Author: aelf-lxy
 * @Date: 2023-08-09 11:15:16
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-10 15:46:45
 * @Description: type file for Search Component
 */
export type TSingle = {
  image: string;
  name: string;
  symbol: string;
  price: number;
  unit: string;
  address: string;
  sortIdx: number;
};

export type TItem = {
  total: number;
  list: Partial<TSingle>[];
};

type TType = 'tokens' | 'nfts' | 'accounts' | 'contracts';

export type TSearchList = {
  [key in TType]?: TItem;
};

export type TFormatSearchList = {
  dataWithOrderIdx: TSearchList;
  allList: Partial<TSingle>[];
};

export type TSearchValidator = {
  [type: string]: {
    limitNumber: number;
    value: number;
  };
};

export type TSearchPanelProps = {
  searchList: TFormatSearchList;
  setKeyWordFn: (val: Partial<TSingle>) => void;
  stopEvent?: (e: any) => void;
  query: string | undefined;
  resetEmpty: () => void;
};
