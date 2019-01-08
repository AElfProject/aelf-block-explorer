/**
 * @file getDividens
 * @author zhouminghui
 */

import {aelf, DIVIDENDSADDRESS} from '../utils';
export default function getDividends(wallet) {
    const dividends = aelf.chain.contractAt(DIVIDENDSADDRESS, wallet);
    return dividends;
}
