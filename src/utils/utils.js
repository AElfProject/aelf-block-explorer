import AElf from "aelf-sdk";
import {aelf} from "../utils";
import config from '../../config/config';

const resourceDecimals = config.resourceTokens.reduce((acc, v) => ({
  ...acc,
  [v.symbol]: v.decimals
}), {})

export const rand16Num = (len = 0) => {
  const result = [];
  for (let i = 0; i < len; i = i + 1) {
    result.push('0123456789abcdef'.charAt(Math.floor(Math.random() * 16)));
  }
  return result.join('');
};

export const removeAElfPrefix = name => {
  if (/^(AElf\.)(.*?)+/.test(name)) {
    return name.split('.')[name.split('.').length - 1];
  }
  return name;
};

export function getFee(transaction) {
  const elfFee = AElf.pbUtils.getTransactionFee(transaction.Logs || []);
  const resourceFees = AElf.pbUtils.getResourceFee(transaction.Logs || []);
  return {
    elf: elfFee.length === 0 ? 0 : (+elfFee[0].amount / 1e8),
    resources: resourceFees.map(v => ({
      ...v,
      amount: (+v.amount / +`1e${resourceDecimals[v.symbol] || 8}`)
    })).reduce((acc, v) => ({
      ...acc,
      [v.symbol]: v.amount
    }), {})
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
  const {
    Indexed = [],
    NonIndexed,
    Name,
    Address
  } = log;
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
      oneofs: true // includes virtual oneof fields set to the present field's name
    });
    return {
      ...acc,
      ...deserialize
    };
  }, {});
  // eslint-disable-next-line max-len
  deserializeLogResult = AElf.utils.transform.transform(dataType, deserializeLogResult, AElf.utils.transform.OUTPUT_TRANSFORMERS);
  deserializeLogResult = AElf.utils.transform.transformArrayToMap(dataType, deserializeLogResult);
  return deserializeLogResult;
}

export function deserializeLogs(logs) {
  return Promise.all(logs.map(log => deserializeLog(log)));
}
