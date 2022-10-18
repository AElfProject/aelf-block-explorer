/**
 * @author hzz780
 * @description
 * 1. Init axios, config axios, make multiple hook instances, etc
 * Please get more config follow this URL https://www.npmjs.com/package/axios-hooks#useaxiosurlconfig-options
 * 2. Please invoke axiosInit before any usages of the useAxios hook
 */
import { configure } from 'axios-hooks';
import LRU from 'lru-cache';
import Axios from 'axios';
import { BASE_URL } from '../../constants/api';
import { useAxiosTDVW } from './multipleHookInstances';
import { interceptorsBind } from './utils';
import { NextPageContext } from 'next';
import { notification } from 'antd';
import { create } from 'apisauce';
import AElf from 'aelf-sdk';
import dayjs from 'dayjs';
import Cookies from 'js-cookie';
import { RPCSERVER } from '../../constants';
const https = require('https');
// At request level
const agent = new https.Agent({
  rejectUnauthorized: false,
});
// Please invoke axiosInit before any usages of the useAxios hook
export default function initAxios() {
  const axios = Axios.create({
    baseURL: BASE_URL,
    timeout: 50000,
  });
  interceptorsBind(axios);

  const cache = new LRU({ max: 10 });

  configure({ axios, cache });
}

export { useAxiosTDVW };

const api = create({
  baseURL: '/api',
});

const httpErrorHandler = (message: string, des: string) =>
  notification.open({
    message,
    description: des,
  });

api.addResponseTransform((res) => {
  if (res.ok) {
    if (res.data.code === /^2\d{2}$/) return res.data;
  }
});
console.log(RPCSERVER, 'RPCSERVER');
const aelf = new AElf(new AElf.providers.HttpProvider(RPCSERVER, 60000));

const get = async (url: string, params?: any, config?: any) => {
  const res = await api.get(url, params, {
    httpsAgent: agent,
    ...config,
  });
  if (res.ok) {
    return res.data as any;
  }

  httpErrorHandler(res.problem, res.problem);
};

const getSSR = async (ctx: NextPageContext, url: string, params?: any, config?: any) => {
  const host = process.env.BUILD_ENDPOINT || ctx.req?.headers.host;
  const baseUrl = '/api';
  const wholeUrl = config?.onlyUrl ? url : `${host}${baseUrl}${url}`;
  const res = await api.get(wholeUrl, params, config);
  // console.log(res, 'res');
  if (res.ok) {
    return res.data as any;
  } else {
    throw new Error(JSON.stringify(res));
  }
};

let CONTRACT_NAMES = {};
const getContractNames = async () => {
  if (Object.keys(CONTRACT_NAMES).length > 0) {
    return CONTRACT_NAMES;
  }
  let res: any = {};
  try {
    res = await get('/viewer/allContracts');
  } catch (e) {
    return CONTRACT_NAMES;
  }
  const { code, data = {} } = res || {};
  if (+code === 0) {
    const { list = [] } = data;
    CONTRACT_NAMES = (list || []).reduce(
      (acc: any, v: any) => ({
        ...acc,
        [v.address]: v,
      }),
      {},
    );
  }
  return CONTRACT_NAMES;
};

const post = async (url, data, config) => {
  // todo: handle the other case
  if (!config) {
    config = { headers: {} };
  }

  const csrf = Cookies.get('csrfToken');
  config.headers['x-csrf-token'] = csrf;
  const res = await api.post(url, data, config);
  if (res.ok) {
    return res.data;
  }

  httpErrorHandler(res.problem, res.problem);
};

const format = (time, fmtStr = 'YYYY-MM-DD HH:mm:ss Z') => dayjs(time).format(fmtStr);

const firstUpperCase = (inputString) => inputString.replace(inputString[0], inputString[0].toUpperCase());

/**
 * the style of the key of the result from the API are different
 * like: block_hash, tx_info, ExecutionState, SignatureState
 * format: block_hash -> BlockHash
 * @Param {string} inputString key
 * return {string}
 */
const formatKey = (inputString) => {
  const pieces = inputString.split('_');
  const piecesFormatted = pieces.map((item) => firstUpperCase(item));
  return piecesFormatted
    .join('')
    .replace(/([A-Z])/g, ' $1')
    .trim();
};

function transactionFormat(result) {
  const newTxs = {
    address_from: result.Transaction.From,
    address_to: result.Transaction.To,
    block_hash: result.BlockHash,
    block_height: result.BlockNumber,
    increment_id: result.Transaction.IncrementId || '',
    method: result.Transaction.MethodName,
    params: result.Transaction.Params,
    tx_id: result.TransactionId,
    tx_status: result.Status,
    tx_fee: result.fee,
    time: result.time,
  };
  return newTxs;
}

const transactionInfo = (hash) => aelf.chain.getTxResult(hash, { sync: true });

function isAElfAddress(address) {
  if (!address) {
    return false;
  }
  try {
    AElf.utils.decodeAddressRep(address);
    return true;
  } catch (e) {
    return false;
  }
}

export {
  get,
  post,
  getSSR,
  aelf,
  format,
  formatKey,
  transactionFormat,
  transactionInfo,
  getContractNames,
  isAElfAddress,
};
