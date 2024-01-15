/**
 * @file calculateCrossConnectorReturn
 * @author zhouminghui
 * Computing Equivalent Value
*/

import { Decimal } from 'decimal.js';

// bt: balanceTo bf: balanceFrom wt: weightTo wt: weightFrom a: buy/sell balance
// Calculate the valuation according to the calculating formula

export default function GetReturnFromPaid(fromConnectorBalance, fromConnectorWeight, toConnectorBalance, toConnectorWeight, paidAmount) {
  // console.log('bf:', fromConnectorBalance, 'wf:', fromConnectorWeight, 'bt', toConnectorBalance, 'wt:', toConnectorWeight, 'a:', paidAmount);
  const bf = fromConnectorBalance;
  const wf = fromConnectorWeight;
  const bt = toConnectorBalance;
  const wt = toConnectorWeight;
  const a = paidAmount;
  if (wf.toNumber() === wt.toNumber()) {
    // if both weights are the same, the formula can be reduce
    return (bt.times(a).div(bf.add(a))).toNumber();
  }
  const x = bf.div(bf.add(a));
  const y = wf.div(wt);
  return new Decimal(1).minus(Decimal.exp(y * Decimal.ln(x))).times(bt).toNumber();
}
