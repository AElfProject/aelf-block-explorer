import { IToken } from '@_types/common';

export interface INFTsTableItem {
  rank: number;
  nftCollection: IToken;
  items: number;
  holders: number;
}

export interface INFTsTableData {
  total: number;
  list: INFTsTableItem[];
}
