/**
 * @file addressFormat
 */
import config from 'constants/config/config';
const { SYMBOL, CHAIN_ID } = config;
export default function addressFormat(address, prefix = SYMBOL, chainId = CHAIN_ID) {
  return `${prefix}_${address}_${chainId}`;
}
