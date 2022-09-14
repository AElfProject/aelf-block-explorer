import AElf from 'aelf-sdk';
import Decimal from 'decimal.js';
import { aelf } from './axios';
import config from '../constants/config/config';

const resourceDecimals = config.resourceTokens.reduce(
  (acc, v) => ({
    ...acc,
    [v.symbol]: v.decimals,
  }),
  {},
);

export const rand16Num = (len = 0) => {
  const result = [];
  for (let i = 0; i < len; i += 1) {
    result.push('0123456789abcdef'.charAt(Math.floor(Math.random() * 16)));
  }
  return result.join('');
};

export const removeAElfPrefix = (name) => {
  if (/^(AElf\.)(.*?)+/.test(name)) {
    return name.split('.')[name.split('.').length - 1];
  }
  return name;
};

const TOKEN_DECIMALS = {
  ELF: 8,
};
let tokenContract = null;

export const FAKE_WALLET = AElf.wallet.getWalletByPrivateKey(config.commonPrivateKey);

export async function getTokenDecimal(symbol) {
  let decimal;
  if (!tokenContract) {
    tokenContract = await aelf.chain.contractAt(config.multiToken, FAKE_WALLET);
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

export function deserializeLogs(logs) {
  return Promise.all(logs.map((log) => deserializeLog(log)));
}

export function getOmittedStr(str = '', front = 8, rear = 4) {
  const strArr = [...str];

  const { length } = str;
  if (length > front + rear) {
    strArr.splice(front, length - rear - front, '...');
    return strArr.join('');
  }
  return str;
}
