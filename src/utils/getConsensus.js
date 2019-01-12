/**
 * @file getConsensus
 * @author zhouminghui
*/

import {aelf} from '../utils';
export default function getConsensus(CONSENSUSADDRESS, wallet) {
    const consensus = aelf.chain.contractAt(CONSENSUSADDRESS, wallet);
    return consensus;
}
