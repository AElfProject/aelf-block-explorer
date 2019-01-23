/**
 * @file getLn
 * @author zhouminghui
*/

export default function Ln(a) {
    let x = 1 - a;
    if (Math.abs(x) >= 1) {
        throw new Error('must be 0 < a < 2');
    }
    let result = 0;
    let iteration = 22;
    while (iteration > 0) {
        result -= Math.pow(x, iteration) / iteration;
        iteration--;
    }

    return result;
}
