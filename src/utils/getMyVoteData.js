/**
 * @file getMyVoteData.js
 * @author zhouminghui
 * = W = 注释我之后补一下，见谅。。。。
 */
import getWallet from './getWallet';
import getConsensus from './getConsensus';
import hexCharCodeToStr from './hexCharCodeToStr';
import formatUtc from './formatUtc';
import formatUtcToDate from './formatUtcToDate';

export default function getMyVoteData(currentWallet) {
    let dataList = [];
    if (!currentWallet) {
        return dataList;
    }
    const wallet = getWallet(currentWallet.privateKey);
    const consensus = getConsensus(wallet);
    const candidatesList = JSON.parse(
        hexCharCodeToStr(consensus.GetCandidatesListToFriendlyString().return)
    );
    let isVote = true;
    let key = 1;
    if (JSON.stringify(candidatesList) !== '{}') {
        for (let i = 0, len = candidatesList.Values.length; i < len; i++) {
            let information = JSON.parse(
                hexCharCodeToStr(consensus.GetCandidateHistoryInfoToFriendlyString(candidatesList.Values[i]).return)
            );
            let votingRecords = JSON.parse(
                hexCharCodeToStr(consensus.GetTicketsInfoToFriendlyString(candidatesList.Values[i]).return)
            ).VotingRecords;
            let nodeName = hexCharCodeToStr(consensus.QueryAlias(candidatesList.Values[i]).return);
            let vote = 0;
            let redeem = false;
            if (votingRecords) {
                for (let j = 0; j < votingRecords.length; j++) {
                    if (
                        votingRecords[j].To === candidatesList.Values[i]
                        && !votingRecords[j].IsWithdrawn
                    ) {
                        vote += parseInt(votingRecords[j].Count, 10);
                    }
                }

                for (let j = 0; j < votingRecords.length; j++) {
                    if (
                        votingRecords[j].From === JSON.parse(localStorage.currentWallet).publicKey
                        && !votingRecords[j].IsWithdrawn
                    ) {
                        if (Date.parse(new Date()) < formatUtc(votingRecords[j].UnlockTimestamp)) {
                            redeem = true;
                        }
                        let data = {};
                        data.key = key;
                        data.serialNumber = data.key;
                        data.term = information.ContinualAppointmentCount || '-';
                        data.block = information.ProducedBlocks || '-';
                        data.vote = vote || '-';
                        data.nodeName = nodeName;
                        data.myVote = parseInt(votingRecords[j].Count, 10) || '-';
                        data.lockDate = formatUtcToDate(votingRecords[j].VoteTimestamp);
                        data.dueDate = formatUtcToDate(votingRecords[j].UnlockTimestamp);
                        data.operation = {
                            publicKey: information.PublicKey,
                            txId: votingRecords[j].TransactionId,
                            vote: isVote,
                            redeem
                        };
                        key++;
                        dataList.push(data);
                    }
                }
            }
        }
        return dataList.reverse();
    }
}

