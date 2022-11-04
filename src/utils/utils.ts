import AElf from 'aelf-sdk';
import debounce from 'lodash.debounce';
import Decimal from 'decimal.js';
import { aelf } from './axios';
const config = require('constants/config/config');
import { API_PATH } from 'constants/viewerApi';
import { request } from './request';
import { NextPageContext } from 'next';

const resourceDecimals = config?.resourceTokens?.reduce(
  (acc, v) => ({
    ...acc,
    [v.symbol]: v.decimals,
  }),
  {},
);

export function isAddress(value) {
  if (/[\u4e00-\u9fa5]/.test(value)) return false;
  try {
    return !!AElf.utils.base58.decode(value);
  } catch {
    return false;
  }
}

export const rand16Num = (len = 0) => {
  const result: string[] = [];
  for (let i = 0; i < len; i += 1) {
    result.push('0123456789abcdef'.charAt(Math.floor(Math.random() * 16)));
  }
  return result.join('');
};

const TOKEN_DECIMALS = {
  ELF: 8,
};
let tokenContract: any = null;

export const FAKE_WALLET = AElf.wallet.getWalletByPrivateKey(config?.commonPrivateKey);

export async function getTokenDecimal(symbol) {
  let decimal;
  if (!tokenContract) {
    tokenContract = await aelf.chain.contractAt(config?.multiToken, FAKE_WALLET);
  }
  if (!TOKEN_DECIMALS[symbol]) {
    try {
      const tokenInfo = await tokenContract.GetTokenInfo.call({
        symbol,
      });
      decimal = tokenInfo.decimals;
    } catch (e) {
      decimal = 8;
    }
    TOKEN_DECIMALS[symbol] = decimal;
  }
  return TOKEN_DECIMALS[symbol];
}

export async function getFee(transaction) {
  const fee = AElf.pbUtils.getTransactionFee(transaction.Logs || []);
  const resourceFees = AElf.pbUtils.getResourceFee(transaction.Logs || []);
  const decimals = await Promise.all(fee.map((f) => getTokenDecimal(f.symbol)));
  return {
    fee: fee
      .map((f, i) => ({
        ...f,
        amount: new Decimal(f.amount || 0).dividedBy(`1e${decimals[i]}`).toString(),
      }))
      .reduce(
        (acc, v) => ({
          ...acc,
          [v.symbol]: v.amount,
        }),
        {},
      ),
    resources: resourceFees
      .map((v) => ({
        ...v,
        amount: new Decimal(v.amount || 0).dividedBy(`1e${resourceDecimals[v.symbol]}`).toString(),
      }))
      .reduce(
        (acc, v) => ({
          ...acc,
          [v.symbol]: v.amount,
        }),
        {},
      ),
  };
}

const CONTRACT_PROTOS = {};
async function getProto(address) {
  if (!CONTRACT_PROTOS[address]) {
    try {
      const file = await aelf.chain.getContractFileDescriptorSet(address);
      CONTRACT_PROTOS[address] = AElf.pbjs.Root.fromDescriptor(file);
    } catch (e) {
      return null;
    }
  }
  return CONTRACT_PROTOS[address];
}

export function deserializeLogs(logs) {
  return Promise.all(logs.map((log) => deserializeLog(log)));
}

const { ellipticEc } = AElf.wallet;

export function getPublicKeyFromObject(publicKey) {
  try {
    return ellipticEc.keyFromPublic(publicKey).getPublic('hex');
  } catch (e) {
    return '';
  }
}

export async function innerHeight(minHeight = 400, time = 0, timeout = 500, maxTime = 10) {
  const currentTime = time + 1;
  if (currentTime > maxTime) {
    return '100vh';
  }
  try {
    const height = document.querySelector('__next')?.clientHeight;
    if (height && height > minHeight) {
      return `${height + 100}px`;
    }
    throw new Error('invalid');
  } catch (e) {
    await sleep(timeout);
    return innerHeight(minHeight, currentTime);
  }
}

export function sendMessage(message = {}, origin = '*') {
  if (window.parent) {
    window.parent.postMessage(
      {
        type: 'viewer',
        message,
      },
      origin,
    );
  }
}

export const sendHeight = debounce((minHeight) => {
  innerHeight(minHeight)
    .then((height) => {
      sendMessage({ height });
    })
    .catch((err) => {
      console.error(err);
    });
}, 100);

const regWeburl = new RegExp(
  '^' +
    // protocol identifier (optional)
    // short syntax // still required
    '(?:(?:(?:https?|ftp):)?\\/\\/)' +
    // user:pass BasicAuth (optional)
    '(?:\\S+(?::\\S*)?@)?' +
    '(?:' +
    // IP address exclusion
    // private & local networks
    '(?!(?:10|127)(?:\\.\\d{1,3}){3})' +
    '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})' +
    '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})' +
    // IP address dotted notation octets
    // excludes loopback network 0.0.0.0
    // excludes reserved space >= 224.0.0.0
    // excludes network & broadcast addresses
    // (first & last IP address of each class)
    '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])' +
    '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}' +
    '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))' +
    '|' +
    // host & domain names, may end with dot
    // can be replaced by a shortest alternative
    // (?![-_])(?:[-\\w\\u00a1-\\uffff]{0,63}[^-_]\\.)+
    '(?:' +
    '(?:' +
    '[a-z0-9\\u00a1-\\uffff]' +
    '[a-z0-9\\u00a1-\\uffff_-]{0,62}' +
    ')?' +
    '[a-z0-9\\u00a1-\\uffff]\\.' +
    ')+' +
    // TLD identifier name, may end with dot
    '(?:[a-z\\u00a1-\\uffff]{2,}\\.?)' +
    ')' +
    // port number (optional)
    '(?::\\d{2,5})?' +
    // resource path (optional)
    '(?:[/?#]\\S*)?' +
    '$',
  'i',
);

export const validateURL = (url) => regWeburl.test(url);

export const removePrefixOrSuffix = (address) => {
  let result = address;
  if (typeof result !== 'string' || !result) {
    return '';
  }
  if (result.startsWith('ELF_')) {
    [, result] = result.split('ELF_');
  }
  if (result.endsWith(`_${config?.viewer.chainId}`)) {
    [result] = result.split(`_${config?.viewer.chainId}`);
  }
  if (/_/.test(result)) {
    [result] = result.split('_').sort((a, b) => b.length || 0 - a.length || 0);
  }
  return result;
};

const fakeWallet = AElf.wallet.getWalletByPrivateKey(config?.commonPrivateKey);

const RPCSERVER_HOST =
  typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : process.env.BUILD_ENDPOINT;
const DEFAUT_RPCSERVER = process.env.NODE_ENV === 'production' ? `${RPCSERVER_HOST}/chain` : `${RPCSERVER_HOST}`;

export const defaultAElfInstance = new AElf(new AElf.providers.HttpProvider(DEFAUT_RPCSERVER));
export async function getBalances(address, search = '') {
  try {
    const balances = await request(
      API_PATH.GET_BALANCES_BY_ADDRESS,
      {
        address,
        search,
      },
      {
        method: 'GET',
      },
    );
    if (balances.length === 0) {
      throw new Error('Zero Balances');
    }
    return balances;
  } catch (e) {
    console.error(e);
    return [
      {
        balance: 0,
        symbol: 'ELF',
      },
    ];
  }
}

export async function getTokenAllInfo(symbol, ctx?: NextPageContext) {
  let url = API_PATH.GET_TOKEN_INFO;
  if (typeof window === 'undefined') {
    const host = process.env.BUILD_ENDPOINT || ctx?.req?.headers.host;
    url = `${host}${url}`;
  }
  try {
    const info = await request(
      url,
      {
        symbol,
      },
      {
        method: 'GET',
      },
    );
    if (Object.keys(info).length === 0) {
      throw new Error(`not exist token ${symbol}`);
    }
    return info;
  } catch (e) {
    console.error(e);
    return {};
  }
}

export async function getTokenList(search = '') {
  let tokens;
  try {
    const { list = [] } = await request(
      API_PATH.GET_TOKEN_LIST,
      {
        search,
      },
      {
        method: 'GET',
      },
    );
    if (list.length === 0) {
      throw new Error('Empty Tokens');
    }
    tokens = list;
  } catch (e) {
    tokens = [
      {
        symbol: 'ELF',
        decimals: 8,
        totalSupply: '1000000000',
      },
    ];
  }
  return tokens.reduce(
    (acc, v) => ({
      ...acc,
      [v.symbol]: v,
    }),
    {},
  );
}

let CONTRACT_NAMES = {};
export const getContractNames = async (ctx?: NextPageContext) => {
  if (Object.keys(CONTRACT_NAMES).length > 0) {
    return CONTRACT_NAMES;
  }
  let res: IAllContractName = {},
    url = API_PATH.GET_ALL_CONTRACT_NAME;
  // ssr
  if (typeof window === 'undefined') {
    const host = process.env.BUILD_ENDPOINT || ctx?.req?.headers.host;
    url = `${host}${url}`;
    console.log(url, 'url');
  }
  try {
    res = await request(
      url,
      {},
      {
        method: 'GET',
      },
    );
  } catch (e) {
    return CONTRACT_NAMES;
  }
  const { list = [] } = res;
  CONTRACT_NAMES = list.reduce(
    (acc, v) => ({
      ...acc,
      [v.address]: v,
    }),
    {},
  );
  return CONTRACT_NAMES;
};

export function removeAElfPrefix(name) {
  if (/^(AElf\.)(.*?)+/.test(name)) {
    return name.split('.')[name.split('.').length - 1];
  }
  return name;
}

export const CONTRACT_INSTANCE_MAP = {};

export async function getContract(aelf, address) {
  if (!CONTRACT_INSTANCE_MAP[address]) {
    CONTRACT_INSTANCE_MAP[address] = await aelf.chain.contractAt(address, fakeWallet);
  }
  return CONTRACT_INSTANCE_MAP[address];
}

export async function getContractDividend(address) {
  try {
    const contract = await getContract(defaultAElfInstance, address);
    if (contract.GetProfitsAmount) {
      const result = await contract.GetProfitsAmount.call();
      return result || {};
    }
    return {};
  } catch (e) {
    console.error(e);
    return {};
  }
}

export async function getContractMethodList(aelf, address) {
  if (!CONTRACT_INSTANCE_MAP[address]) {
    CONTRACT_INSTANCE_MAP[address] = await aelf.chain.contractAt(address, fakeWallet);
  }
  const contract = CONTRACT_INSTANCE_MAP[address];
  return Object.keys(contract)
    .filter((v) => /^[A-Z]/.test(v))
    .sort();
}

const contractsNamesMap = {};

export async function getContractByName(name) {
  if (!contractsNamesMap[name]) {
    const { GenesisContractAddress } = await defaultAElfInstance.getChainStatus();
    const zeroContract = await getContract(defaultAElfInstance, GenesisContractAddress);
    contractsNamesMap[name] = await zeroContract.GetContractAddressByName.call(AElf.utils.sha256(name));
  }
  return getContract(defaultAElfInstance, contractsNamesMap[name]);
}

function decodeBase64(str) {
  const { util } = AElf.pbjs;
  const buffer = util.newBuffer(util.base64.length(str));
  util.base64.decode(str, buffer, 0);
  return buffer;
}

export async function deserializeLog(log) {
  const { Indexed = [], NonIndexed, Name, Address } = log;
  const proto = await getProto(Address);
  if (!proto) {
    return {};
  }
  const serializedData = [...(Indexed || [])];
  if (NonIndexed) {
    serializedData.push(NonIndexed);
  }
  const dataType = proto.lookupType(Name);
  let deserializeLogResult = serializedData.reduce((acc, v) => {
    let deserialize = dataType.decode(decodeBase64(v));
    deserialize = dataType.toObject(deserialize, {
      enums: String, // enums as string names
      longs: String, // longs as strings (requires long.js)
      bytes: String, // bytes as base64 encoded strings
      defaults: false, // includes default values
      arrays: true, // populates empty arrays (repeated fields) even if defaults=false
      objects: true, // populates empty objects (map fields) even if defaults=false
      oneofs: true, // includes virtual oneof fields set to the present field's name
    });
    return {
      ...acc,
      ...deserialize,
    };
  }, {});
  // eslint-disable-next-line max-len
  deserializeLogResult = AElf.utils.transform.transform(
    dataType,
    deserializeLogResult,
    AElf.utils.transform.OUTPUT_TRANSFORMERS,
  );
  deserializeLogResult = AElf.utils.transform.transformArrayToMap(dataType, deserializeLogResult);
  return deserializeLogResult;
}

export const sleep = (time) =>
  new Promise((resolve) => {
    const ids = setTimeout(() => {
      clearTimeout(ids);
      resolve('sleep');
    }, time);
  });

export const omitString = (input, start = 8, end = 8) => {
  if (!input) return '';
  return `${input.slice(0, start)}...${input.slice(-end)}`;
};

import JSZip from 'jszip';
import { IAllContractName } from 'page-components/Txs/types';

function addFileOrFolder(zip, files) {
  files.forEach((file) => {
    const { name } = file;
    if (Array.isArray(file.files) && file.files.length > 0) {
      addFileOrFolder(zip.folder(name), file.files);
    } else {
      const content = atob(file.content);
      zip.file(name, content);
    }
  });
}

export const getZip = (files) => {
  const zip = new JSZip();
  addFileOrFolder(zip, files);
  return zip.generateAsync({
    type: 'blob',
  });
};

export const detectMobileBrowser = () => {
  if (typeof window !== 'undefined') {
    return !!(
      navigator.userAgent.match(/Android/i) ||
      navigator.userAgent.match(/webOS/i) ||
      navigator.userAgent.match(/iPhone/i) ||
      navigator.userAgent.match(/iPod/i) ||
      navigator.userAgent.match(/BlackBerry/i) ||
      navigator.userAgent.match(/Windows Phone/i)
    );
  }
};

export const useSearchParams = (search, key) => new URLSearchParams(search).get(key);
