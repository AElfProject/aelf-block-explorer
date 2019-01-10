/**
 * @file getCandidatesList.js
 * @author zhouminghui
 * 获取当前候选节点列表
 */

import getWallet from './getWallet';
import getConsensus from './getConsensus';
import hexCharCodeToStr from './hexCharCodeToStr';
import {MINERSPRIVATEKEY} from '../../config/config';

// let a = {
//     key: '2',
//     serialNumber: '2',
//     nodeName: 'aelf-hdbo-6785',
//     term: '2',
//     block: '756',
//     vote: '123123',
//     myVote: '2000',
//     dueDate: '2018-11-11',
//     lockDate: '3个月',
//     operation: {
//         address: 'bbbbbb',
//         vote: true,
//         redeem: true
//     }
// };

export default function getCandidatesList(currentWallet, startIndex) {
    let wallet = null;
    let isVote = null;
    if (currentWallet.publicKey === '') {
        wallet = getWallet(MINERSPRIVATEKEY);
        isVote = false;
    }
    else {
        wallet = getWallet(currentWallet.privateKey);
        isVote = true;
    }
    let dataList = [];
    const consensus = getConsensus(wallet);
    const nodeList = JSON.parse(
        hexCharCodeToStr(
            consensus.GetPageableCandidatesHistoryInfoToFriendlyString(startIndex.page, startIndex.pageSize).return
        )
    );
    let CandidatesNumber = nodeList.CandidatesNumber;
    let nodeListMaps = nodeList.Maps;
    let nodePublicKeyList = null;
    if (nodeListMaps) {
        nodePublicKeyList = Object.keys(nodeListMaps);
        for (let i = 0; i < nodePublicKeyList.length; i++) {
            let nodeInformation = nodeListMaps[nodePublicKeyList[i]];
            let data = {
                key: startIndex.page + i + 1,
                serialNumber: startIndex.page + i + 1,
                nodeName: nodeInformation.CurrentAlias,
                term: nodeInformation.ReappointmentCount || '-',
                block: nodeInformation.ProducedBlocks || '-',
                vote: nodeInformation.CurrentVotesNumber || '-',
                myVote: 0 || '-',
                operation: {
                    publicKey: nodePublicKeyList[i] || '',
                    vote: isVote,
                    redeem: true
                }
            };
            dataList.push(data);
        }
    }
    return {dataList, CandidatesNumber, nodePublicKeyList};
}
