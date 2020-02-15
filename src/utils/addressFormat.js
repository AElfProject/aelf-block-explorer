/**
 * @file addressFormat
 */
import {ADDRESS_INFO} from '../../config/config'

export default function addressFormat(address, prefix, chainId) {
  return `${prefix || ADDRESS_INFO.PREFIX}_${address}_${chainId || ADDRESS_INFO.CURRENT_CHAIN_ID}`;
};
