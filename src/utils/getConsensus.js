/**
 * @file getConsensus
 * @author zhouminghui
*/

import {aelf, CONSENSUSADDRESS} from '../utils';
export default function getConsensus(wallet) {
    const consensus = aelf.chain.contractAt(CONSENSUSADDRESS, wallet);
    return consensus;
}
