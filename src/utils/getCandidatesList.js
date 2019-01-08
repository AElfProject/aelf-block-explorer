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

export default function getCandidatesList(currentWallet) {
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

    const consensus = getConsensus(wallet);
    let candidatesList = JSON.parse(hexCharCodeToStr(consensus.GetCandidatesListToFriendlyString().return));
    console.log(JSON.parse(hexCharCodeToStr(consensus.GetCurrentElectionInfoToFriendlyString(0, 20, 0).return)));
    let dataList = [];
    if (JSON.stringify(candidatesList) !== '{}') {
        for (let i = 0, len = candidatesList.Values.length; i < len; i++) {
            let data = {};
            let information = JSON.parse(
                hexCharCodeToStr(consensus.GetCandidateHistoryInfoToFriendlyString(candidatesList.Values[i]).return)
            );
            let ticketsInfo = JSON.parse(
                hexCharCodeToStr(consensus.GetTicketsInfoToFriendlyString(candidatesList.Values[i]).return)
            );
            let nodeName = hexCharCodeToStr(consensus.QueryAlias(candidatesList.Values[i]).return);
            let votingRecords = ticketsInfo.VotingRecords;
            let myVote = 0;
            let vote = 0;
            let redeem = true;
            if (votingRecords) {
                for (let j = 0; j < votingRecords.length; j++) {
                    if (
                        votingRecords[j].From === JSON.parse(localStorage.currentWallet).publicKey
                        && !votingRecords[j].IsWithdrawn
                    ) {
                        myVote += parseInt(votingRecords[j].Count, 10);
                    }

                    if (
                        votingRecords[j].To === candidatesList.Values[i]
                        && !votingRecords[j].IsWithdrawn
                    ) {
                        vote += parseInt(votingRecords[j].Count, 10);
                    }
                }
            }
            data.key = i + 1;
            data.serialNumber = data.key;
            data.term = information.ContinualAppointmentCount || '-';
            data.block = information.ProducedBlocks || '-';
            data.vote = vote || '-';
            data.nodeName = nodeName;
            data.myVote = myVote || '-';
            data.operation = {
                publicKey: information.PublicKey,
                vote: isVote,
                redeem
            };
            dataList.push(data);
        }
    }
    return dataList;
}