const SYMBOL = process.env.NEXT_PUBLIC_SYMBOL;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

export function getPathnameFirstSlash(pathname: string) {
  const secondSlashIndex = pathname.slice(1).indexOf('/');
  const firstSlash = pathname.slice(0, secondSlashIndex + 1);
  return firstSlash;
}
export default function addressFormat(address: string, prefix?: string, chainId?: string) {
  if (!address) return '';
  return `${prefix || SYMBOL}_${address}_${chainId || CHAIN_ID}`;
}

export const hiddenAddress = (str: string, frontLen = 4, endLen = 4) => {
  return `${str.substring(0, frontLen)}...${str.substring(str.length - endLen)}`;
};
