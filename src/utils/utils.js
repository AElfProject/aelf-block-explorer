import AElf from "aelf-sdk";
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
