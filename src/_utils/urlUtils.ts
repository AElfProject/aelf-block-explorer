const SYMBOL = process.env.NEXT_PUBLIC_SYMBOL;
import { store } from '@_store';

export function getPathnameFirstSlash(pathname: string) {
  const secondSlashIndex = pathname.slice(1).indexOf('/');
  const firstSlash = pathname.slice(0, secondSlashIndex + 1);
  return firstSlash;
}
export default function addressFormat(address: string, prefix?: string, chainId?: string) {
  const defaultChainId = store.getState().getChainId.defaultChain;
  console.log(defaultChainId, 'defaultChainId');
  if (!address) return '';
  return `${prefix || SYMBOL}_${address}_${chainId || defaultChainId}`;
}

export const hiddenAddress = (str: string, frontLen = 4, endLen = 4) => {
  return `${str.substring(0, frontLen)}...${str.substring(str.length - endLen)}`;
};
