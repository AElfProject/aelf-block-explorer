/**
 * @file calculateCrossConnectorReturn
 * @author zhouminghui
 * Computing Equivalent Value
*/

import getLn from './getLn';
export default function scalculateCrossConnectorReturn(ResBalance, ResWeight, ElfBalance, ElfWeight, pidRes) {
    console.log('bf:', ResBalance, 'wf:', ResWeight, 'bt', ElfBalance, 'wt:', ElfWeight, 'a:', pidRes);
    const bf = parseInt(ResBalance, 10);
    const wf = parseInt(ResWeight, 10);
    const bt = parseInt(ElfBalance, 10);
    const wt = parseInt(ElfWeight, 10);
    const a = parseInt(pidRes, 10);
    if (wf === wt) {
        // if both weights are the same, the formula can be reduced
        console.log((bt * Math.abs(a) / (bf + a)));
        return (bt * Math.abs(a) / (bf + a));
    }

    const x = bf / (bf + a);
    const y = wf / wt;
    return (bt * (1 - Math.exp(y * getLn(x))));

}

