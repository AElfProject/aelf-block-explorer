/**
 * @file voteContract.js
 * @author zhouminghui
*/

import {aelf} from '../utils';
import * as Aelf from 'aelf-sdk';
import {commonPrivateKey} from '../../config/config';

export default function voteContract() {
    let contractAddress = aelf.chain.connectChain().result;
    const CONSENSUSADDRESS = contractAddress['AElf.Contracts.Consensus'];
    const DIVIDENDSADDRESS = contractAddress['AElf.Contracts.Dividends'];
    const TOKENADDRESS = contractAddress['AElf.Contracts.Token'];
    const wallet = Aelf.wallet.getWalletByPrivateKey(commonPrivateKey);
    const consensus = aelf.chain.contractAt(CONSENSUSADDRESS, wallet);
    const dividends = aelf.chain.contractAt(DIVIDENDSADDRESS, wallet);
    const tokenContract = aelf.chain.contractAt(TOKENADDRESS, wallet);
    const output = {
        CONSENSUSADDRESS,
        DIVIDENDSADDRESS,
        TOKENADDRESS,
        consensus,
        dividends,
        tokenContract
    };
    return output;
}
