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

export default function getMyVoteData(currentWallet, startIndex) {
    let dataList = [];
    if (!currentWallet) {
        return dataList;
    }
    const wallet = getWallet(currentWallet.privateKey);
    const consensus = getConsensus(wallet);
    const ticketsInfo = JSON.parse(
        hexCharCodeToStr(
            consensus.GetPageableTicketsInfoToFriendlyString(
                currentWallet.publicKey, startIndex.page, startIndex.pageSize
            ).return
        )
    );
    const ticketsInfoList = ticketsInfo.VotingRecords;
    const VotingRecordsCount = ticketsInfo.VotingRecordsCount;
    if (ticketsInfoList) {
        for (let i = 0; i < ticketsInfoList.length; i++) {
            let ticket = ticketsInfoList[i];
            let data = {
                key: startIndex.page + i + 1,
                serialNumber: startIndex.page + i + 1,
                nodeName: hexCharCodeToStr(consensus.QueryAlias(ticket.To).return),
                term: ticket.TermNumber,
                vote: parseInt(consensus.QueryObtainedNotExpiredVotes(ticket.To).return, 16) || '-',
                myVote: ticket.Count,
                lockDate: formatUtcToDate(ticket.VoteTimestamp),
                dueDate: formatUtcToDate(ticket.UnlockTimestamp),
                operation: {
                    txId: ticket.TransactionId,
                    publicKey: ticket.To,
                    vote: true,
                    redeem: Date.parse(new Date()) < formatUtc(ticket.UnlockTimestamp)
                }
            };
            dataList.push(data);
        }
    }
    return {dataList, VotingRecordsCount};
}

