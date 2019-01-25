/**
 * @file getCandidatesList.js
 * @author zhouminghui
 * 获取当前候选节点列表
 */


import hexCharCodeToStr from './hexCharCodeToStr';
import {commonPrivateKey} from '../../config/config';

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

export default function getCandidatesList(currentWallet, startIndex, contracts) {
    let isVote = true;
    let isRedee = true;
    if (currentWallet) {
        if (currentWallet.publicKey === '') {
            isVote = false;
            isRedee = false;
        }
    }
    else {
        isVote = false;
        isRedee = false;
    }

    let dataList = [];
    const consensus = contracts.consensus;
    const nodeList = JSON.parse(
        hexCharCodeToStr(
            consensus.GetPageableCandidatesHistoryInfoToFriendlyString(startIndex.page, startIndex.pageSize).return
        )
    );
    let CandidatesNumber = nodeList.CandidatesNumber;
    let nodeListMaps = nodeList.Maps || [];
    let serial = 0;
    for (let i in nodeListMaps) {
        let nodeInformation = nodeListMaps[i];
        let data = {
            key: startIndex.page + serial + 1,
            serialNumber: startIndex.page + serial + 1,
            nodeName: nodeInformation.CurrentAlias,
            term: nodeInformation.ReappointmentCount || '-',
            block: nodeInformation.ProducedBlocks || '-',
            vote: nodeInformation.CurrentVotesNumber || '-',
            myVote: 0 || '-',
            operation: {
                publicKey: i || '',
                vote: isVote,
                redeem: isRedee
            }
        };
        serial++;
        dataList.push(data);
    }
    return {dataList, CandidatesNumber};
}
