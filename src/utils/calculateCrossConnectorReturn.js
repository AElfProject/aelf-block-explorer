/**
 * @file calculateCrossConnectorReturn
 * @author zhouminghui
 * Computing Equivalent Value
*/

export default function scalculateCrossConnectorReturn(ResBalance, ResWeight, ElfBalance, ElfWeight, pidRes) {
    console.log('bf:', ResBalance, 'wf:', ResWeight, 'bt', ElfBalance, 'wt:', ElfWeight, 'a:', pidRes);
    const bt = ResBalance;
    const wt = ResWeight;
    const bf = ElfBalance;
    const wf = ElfWeight;
    const a = pidRes;
    if (wf === wt) {
        // if both weights are the same, the formula can be reduced
        return (bf * a / (bt - a));
    }

    const x = bt / (bt - a);
    const y = wt / wf;
    return ((Math.pow(x, y) - 1) * bf);
}

