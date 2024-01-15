/**
 * @file get all tokens
 * @author atom-yang
 */
import {
  get,
} from '../utils';

let tokens = [];
let lastTimestamp = new Date().valueOf();
const TIME_EXPIRED = 10 * 60 * 1000;
const API_PATH = '/proposal/tokenList';
export default async function getAllTokens() {
  const now = new Date().valueOf();
  if (tokens.length === 0 || lastTimestamp < now - TIME_EXPIRED) {
    let results;
    try {
      results = await get(API_PATH);
      const {
        data = {},
      } = results;
      let {
        list = [],
      } = data;
      if (!list || list.length === 0) {
        list = [
          {
            symbol: 'ELF',
            decimals: 8,
          },
        ];
      }
      results = list;
    } catch (e) {
      results = [
        {
          symbol: 'ELF',
          decimals: 8,
        },
      ];
    }
    tokens = [...results];
    lastTimestamp = now;
  }
  return tokens;
}
