/**
 * @file calculateCrossConnectorElfReturn
 * @author zhouminghui
 * Computing Equivalent Value
*/

export default function calculateCrossConnectorElfReturn(ResBalance, ResWeight, ElfBalance, ElfWeight, pidRes) {
    console.log('bf:', ResBalance, 'wf:', ResWeight, 'bt', ElfBalance, 'wt:', ElfWeight, 'a:', pidRes);
    const bf = ResBalance;
    const wf = ResWeight;
    const bt = ElfBalance;
    const wt = ElfWeight;
    const a = pidRes;
    if (wf === wt) {
        // if both weights are the same, the formula can be reduced
        return (bt * a / (bf + a));
    }

    const x = bf / (bf + a);
    const y = wf / wt;
    return ((1 - Math.pow(x, y)) * bt);
}

