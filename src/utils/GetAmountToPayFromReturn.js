/**
 * @file GetAmountToPayFromReturn
 * @author zhouminghui
 * Computing Equivalent Value
*/

import { Decimal } from 'decimal.js';
// bt: balanceTo bf: balanceFrom wt: weightTo wt: weightFrom a: buy/sell balance
// Calculate the valuation according to the calculating formula

export default function GetAmountToPayFromReturn(fromConnectorBalance, fromConnectorWeight, toConnectorBalance, toConnectorWeight, amountToReceive) {
  // console.log(
  //     'bf:', fromConnectorBalance.toString(),
  //     'wf:', fromConnectorWeight.toString(),
  //     'bt', toConnectorBalance.toString(),
  //     'wt:', toConnectorWeight.toString(),
  //     'a:', amountToReceive.toString()
  // );
  const bf = fromConnectorBalance;
  const wf = fromConnectorWeight;
  const bt = toConnectorBalance;
  const wt = toConnectorWeight;
  const a = amountToReceive;

  if (wf.toNumber() === wt.toNumber()) {
    // if both weights are the same, the formula can be reduced
    // return (bt * a / (bf + a));
    return (bf.times(a).div(bt.minus(a))).toNumber();
  }

  // For non-integer or very large exponents pow(x, y) is calculated using
  // x^y = exp(y*ln(x))
  const x = bt.div(bt.minus(a));
  const y = wt.div(wf);
  return Decimal.exp(y * Decimal.ln(x)).minus(1).times(bf).toNumber();
}
