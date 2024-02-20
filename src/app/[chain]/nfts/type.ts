import { IToken } from '@_types/common';

interface ICollectionItem {
  symbol: string;
  count: number;
}

export interface INFTsTableItem {
  rank: number;
  nftCollection: IToken;
  items: number;
  holders: number;
  itemList: ICollectionItem[];
}

export interface INFTsTableData {
  total: number;
  list: INFTsTableItem[];
}
