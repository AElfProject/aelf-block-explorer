/**
 * @file getVotingRecordData
 * @author zhouminghui
 * format VotingRecordData
*/

import getWallet from './getWallet';
import getConsensus from './getConsensus';
import hexCharCodeToStr from '../utils/hexCharCodeToStr';

export default function getVotingRecordData(privateKey, publicKey) {
    let data = [];
    const wallet = getWallet(privateKey);
    const consensus = getConsensus(wallet);
    // console.log(JSON.parse(hexCharCodeToStr(consensus.GetTicketsInfoToFriendlyString(publicKey).return)));
}