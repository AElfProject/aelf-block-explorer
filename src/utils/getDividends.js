/**
 * @file getDividens
 * @author zhouminghui
 */

import {aelf} from '../utils';
export default function getDividends(DIVIDENDSADDRESS, wallet) {
    const dividends = aelf.chain.contractAt(DIVIDENDSADDRESS, wallet);
    return dividends;
}
