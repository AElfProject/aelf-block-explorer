/**
 * @file calculateCrossConnectorReturn
 * @author zhouminghui
 * Computing Equivalent Value
*/

import BigNumber from 'bignumber.js';

// bt: balanceTo bf: balanceFrom wt: weightTo wt: weightFrom a: buy/sell balance
// Calculate the valuation according to the calculating formula

export default function scalculateCrossConnectorReturn(ResBalance, ResWeight, ElfBalance, ElfWeight, pidRes) {
    console.log('bf:', ResBalance, 'wf:', ResWeight, 'bt', ElfBalance, 'wt:', ElfWeight, 'a:', pidRes);
    const bt = ResBalance;
    const wt = ResWeight;
    const bf = ElfBalance;
    const wf = ElfWeight;
    const a = pidRes;
    if (wf.toNumber() === wt.toNumber()) {
        // if both weights are the same, the formula can be reduced
        return (bf.times(a).div(bt.minus(a))).toNumber();
    }

    const x = bt.div(bt.minus(a)).toNumber();
    const y = wt.div(wf).toNumber();
    return (Math.pow(x, y) - 1) * bf;
}

