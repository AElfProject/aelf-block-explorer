const SYMBOL = process.env.NEXT_PUBLIC_SYMBOL;
import { store } from '@_store';
import { Chain } from 'global';

export function getPathnameFirstSlash(pathname: string) {
  const secondSlashIndex = pathname.slice(1).indexOf('/');
  const firstSlash = pathname.slice(0, secondSlashIndex + 1);
  return firstSlash;
}
export default function addressFormat(address: string, chainId?: string, prefix?: string) {
  const defaultChainId = store.getState().getChainId.defaultChain;
  if (!address) return '';
  return `${prefix || SYMBOL}_${address}_${chainId || defaultChainId}`;
}

export const hiddenAddress = (str: string, frontLen = 4, endLen = 4) => {
  return `${str.substring(0, frontLen)}...${str.substring(str.length - endLen)}`;
};

export const getChainByPath = (path: string) => {
  const url = new URL(path);
  const searchParams = url.searchParams;
  const chainId = searchParams.get('chainId');
  return chainId as unknown as Chain;
};
