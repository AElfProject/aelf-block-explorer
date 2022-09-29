/**
 * @file getTokenBalance.js
 * @author zhouminghui
 * @description get token balance
*/
import { Decimal } from 'decimal.js';

export default function getTokenBalance(tokenConverterContract, type) {
  // stupid code before, do not hire people like this anymore
  return tokenConverterContract.GetDepositConnectorBalance.call({
    value: type,
  }).then((result) => {
    const balance = result && result.value ? result.value : 0;
    return {
      elfBalance: new Decimal(balance),
    };
  });
}
