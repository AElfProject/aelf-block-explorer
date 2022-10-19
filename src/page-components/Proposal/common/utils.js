/**
 * @file utils
 * @author atom-yang
 */
import { message } from 'antd';
import moment from 'moment';
import constants from './constants';
import { request } from 'utils/request';
import { API_PATH } from 'constants/viewerApi';
import { deserializeLog } from 'utils/utils';

const { viewer } = constants;

export const arrayToMap = (arr) =>
  arr.reduce(
    (acc, v) => ({
      ...acc,
      [v]: v,
    }),
    {},
  );

export const getContractAddress = (name) => {
  const result = viewer.contractAddress.filter((item) => item.contractName === name);
  return result.length > 0 ? result[0].contractAddress : getContractAddress('Genesis');
};

export const parseJSON = (str = '') => {
  let result = null;
  try {
    result = JSON.parse(str);
  } catch (e) {
    result = str;
  }
  return result;
};

export const getSignParams = async (wallet, currentWallet) => {
  const timestamp = new Date().getTime();
  try {
    const signature = await wallet.sign(timestamp);
    return {
      address: currentWallet.address,
      signature,
      pubKey: currentWallet.publicKey,
      timestamp,
    };
  } catch (e) {
    message.warn((e.errorMessage || {}).message || 'night ELF is locked!');
    return {};
  }
};

export const rand16Num = (len = 0) => {
  const result = [];
  for (let i = 0; i < len; i += 1) {
    result.push('0123456789abcdef'.charAt(Math.floor(Math.random() * 16)));
  }
  return result.join('');
};

export const showTransactionResult = (result) => {
  if ((result && +result.error === 0) || !result.error) {
    message.info('The transaction is in progress. Please query the transaction ID', 10);
    message.info(`Transaction ID: ${result.TransactionId || result.result.TransactionId}`, 10);
    return result;
  }
  throw new Error((result.errorMessage || {}).message || 'Send transaction failed');
};

export function isInnerType(inputType) {
  return (
    inputType.fieldsArray &&
    inputType.fieldsArray.length === 1 &&
    (inputType.name === 'Hash' || inputType.name === 'Address') &&
    inputType.fieldsArray[0].type === 'bytes'
  );
}

export function isSingleStringParameter(inputType) {
  return (
    (inputType.fieldsArray &&
      inputType.fieldsArray.length === 1 &&
      inputType.fieldsArray[0].type.indexOf('.') === -1) ||
    isInnerType(inputType)
  );
}

export function isEmptyInputType(inputType) {
  return !inputType.fieldsArray || inputType.fieldsArray.length === 0;
}

export function isSpecialParameters(inputType) {
  return inputType.type.indexOf('aelf.Address') > -1 || inputType.type.indexOf('aelf.Hash') > -1;
}

export function getParams(inputType) {
  const fieldsLength = Object.keys(inputType.toJSON().fields || {}).length;
  let result = {};
  if (fieldsLength === 0) {
    return {};
  }
  if (isInnerType(inputType)) {
    const type = inputType.fieldsArray[0];
    return {
      [type.name]: {
        repeated: type.repeated,
        type: inputType.name,
        name: type.name,
        required: type.required,
      },
    };
  }
  Object.keys(inputType.fields).forEach((name) => {
    const type = inputType.fields[name];
    if (
      type.resolvedType &&
      !isSpecialParameters(type) &&
      (type.type || '').indexOf('google.protobuf.Timestamp') === -1
    ) {
      result = {
        ...result,
        [type.name]: getParams(type.resolvedType),
      };
    } else {
      result = {
        ...result,
        [name]: {
          repeated: type.repeated,
          type: type.type,
          name: type.name,
          required: type.required,
        },
      };
    }
  });
  return result;
}

export function formatTimeToNano(time) {
  return {
    seconds: moment(time).unix(),
    nanos: moment(time).milliseconds() * 1000000,
  };
}

export function uint8ToBase64(u8Arr) {
  const CHUNK_SIZE = 0x8000;
  let index = 0;
  const arrLength = u8Arr.length;
  let result = '';
  let slice;
  while (index < arrLength) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, arrLength));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  return btoa(result);
}

export function base64ToHex(base64) {
  const raw = atob(base64);
  let result = '';
  for (let i = 0; i < raw.length; i++) {
    const hex = raw.charCodeAt(i).toString(16);
    result += hex.length === 2 ? hex : `0${hex}`;
  }
  return result.toUpperCase();
}

// eslint-disable-next-line consistent-return
export const sendTransaction = async (wallet, contractAddress, method, param) => {
  try {
    const result = await wallet.invoke({
      contractAddress,
      param,
      contractMethod: method,
    });
    showTransactionResult(result);
    return result;
  } catch (e) {
    message.error((e.errorMessage || {}).message || e.message || 'Send Transaction failed');
  }
};

export async function getTxResult(aelf, txId, times = 0, delay = 3000, timeLimit = 10) {
  const currentTime = times + 1;
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });
  let tx;
  try {
    tx = await aelf.chain.getTxResult(txId);
  } catch (e) {
    if (e.Status) {
      return e;
    }
    throw new Error('Network Error');
  }
  if (tx.Status === 'PENDING' && currentTime <= timeLimit) {
    const result = await getTxResult(aelf, txId, currentTime, delay, timeLimit);
    return result;
  }
  if (tx.Status === 'PENDING' && currentTime > timeLimit) {
    return tx;
  }
  if (tx.Status === 'MINED') {
    return tx;
  }
  return tx;
}

export const commonFilter = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

export function getCsrfToken() {
  // eslint-disable-next-line no-useless-escape
  return document.cookie.replace(/(?:(?:^|.*;\s*)csrfToken\s*\=\s*([^;]*).*$)|^.*$/, '$1');
}

export async function updateContractName(wallet, currentWallet, params) {
  const signedParams = await getSignParams(wallet, currentWallet);
  if (Object.keys(signedParams).length > 0) {
    return request(
      API_PATH.UPDATE_CONTRACT_NAME,
      {
        ...params,
        ...signedParams,
      },
      {
        headers: {
          'x-csrf-token': getCsrfToken(),
        },
      },
    );
  }
  throw new Error('get signature failed');
}

export async function addContractName(wallet, currentWallet, params) {
  const signedParams = await getSignParams(wallet, currentWallet);
  if (Object.keys(signedParams).length > 0) {
    return request(
      API_PATH.ADD_CONTRACT_NAME,
      {
        ...params,
        ...signedParams,
      },
      {
        headers: {
          'x-csrf-token': getCsrfToken(),
        },
      },
    );
  }
  throw new Error('get signature failed');
}

export async function getDeserializeLog(aelf, txId, logName) {
  if (!txId) throw new Error('Transaction failed. Please reinitiate this step.');
  const txResult = await getTxResult(aelf, txId ?? '');
  if (txResult.Status === 'MINED') {
    const { Logs = [] } = txResult;
    const log = (Logs || []).filter((v) => v.Name === logName);
    if (log.length === 0) {
      return;
    }
    const result = await deserializeLog(log[0], log[0].Name, log[0].Address);
    // eslint-disable-next-line consistent-return
    return result;
  }
}

export function getContractURL(address) {
  // eslint-disable-next-line max-len
  return `${window.location.protocol}//${window.location.host}/contract/${address}`;
}
