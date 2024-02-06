import { isAElfAddress, isTxHash } from '@_utils/isAElfAddress';
import { SearchType } from './type';
export const formatSearchValue = (val: string) => {
  if (!val) return '';
  let tempValue = val.trim();

  if (tempValue.indexOf('_') > 0) {
    [, tempValue] = tempValue.split('-');
  }

  return tempValue;
};

export const getSearchType = (str: string) => {
  if (!str) return SearchType.other;

  if (isAElfAddress(str)) return SearchType.address;

  if (isTxHash(str)) return SearchType.txHash;

  return SearchType.other;
};
