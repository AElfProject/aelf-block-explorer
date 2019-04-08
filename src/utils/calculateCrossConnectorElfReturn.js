/**
 * @file calculateCrossConnectorElfReturn
 * @author zhouminghui
 * Computing Equivalent Value
*/

import {Decimal} from 'decimal.js';
// bt: balanceTo bf: balanceFrom wt: weightTo wt: weightFrom a: buy/sell balance
// Calculate the valuation according to the calculating formula

export default function calculateCrossConnectorElfReturn(ResBalance, ResWeight, ElfBalance, ElfWeight, pidRes) {
    console.log('bf:', ResBalance, 'wf:', ResWeight, 'bt', ElfBalance, 'wt:', ElfWeight, 'a:', pidRes);
    const bf = ResBalance;
    const wf = ResWeight;
    const bt = ElfBalance;
    const wt = ElfWeight;
    const a = pidRes;

    if (wf.toNumber() === wt.toNumber()) {
        // if both weights are the same, the formula can be reduced
        // return (bt * a / (bf + a));
        return (bt.times(a).div(bf.plus(a))).toNumber();
    }

    const x = bf.div(bf.plus(a));
    const y = wt.div(wf);
    return new Decimal(1).minus(Decimal.exp(y * Decimal.ln(x))).times(bt).toNumber();
}

