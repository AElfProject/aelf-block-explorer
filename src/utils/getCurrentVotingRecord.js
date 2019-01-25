/**
 * @file getCurrentVoting.js
 * @author zhouminghui
 * Get all transaction records for the current account
*/

import getConsensus from './getConsensus';
import hexCharCodeToStr from './hexCharCodeToStr';
import getPublicKey from './getPublicKey';
import {commonPrivateKey} from '../../config/config';
import * as Aelf from 'aelf-sdk';

export default function getCurrentVotingRecord(currentWallet, contracts) {
    let key = null;
    if (currentWallet) {
        if (currentWallet.address === '') {
            key = Aelf.wallet.getWalletByPrivateKey(commonPrivateKey).keyPair.getPublic().encode('hex');
        }
        else {
            key = getPublicKey(currentWallet.publicKey);
        }
    }
    else {
        key = Aelf.wallet.getWalletByPrivateKey(commonPrivateKey).keyPair.getPublic().encode('hex');
    }
    const consensus = getConsensus(contracts.CONSENSUSADDRESS, contracts.wallet);
    const votingRecord = JSON.parse(
        hexCharCodeToStr(
            consensus.GetTicketsInfoToFriendlyString(key).return
        )
    );
    return votingRecord;
}