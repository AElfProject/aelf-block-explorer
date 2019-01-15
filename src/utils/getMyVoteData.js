/**
 * @file getMyVoteData.js
 * @author zhouminghui
 * Get my voting list data
 */
import getWallet from './getWallet';
import getConsensus from './getConsensus';
import hexCharCodeToStr from './hexCharCodeToStr';
import dayjs from 'dayjs';
import getHexNumber from './getHexNumber';

export default function getMyVoteData(currentWallet, startIndex, CONSENSUSADDRESS) {
    let dataList = [];
    if (!currentWallet) {
        return dataList;
    }
    const wallet = getWallet(currentWallet.privateKey);
    const consensus = getConsensus(CONSENSUSADDRESS, wallet);
    const ticketsInfo = JSON.parse(
        hexCharCodeToStr(
            consensus.GetPageableNotWithdrawnTicketsInfoToFriendlyString(
                currentWallet.publicKey, startIndex.page, startIndex.pageSize
            ).return
        )
    );
    const ticketsInfoList = ticketsInfo.VotingRecords || [];
    console.log(ticketsInfoList);
    const VotingRecordsCount = ticketsInfo.VotingRecordsCount;
    ticketsInfoList.map((item, index) => {
        let data = {
            key: startIndex.page + index + 1,
            serialNumber: startIndex.page + index + 1,
            nodeName: hexCharCodeToStr(consensus.QueryAlias(item.To).return),
            term: item.TermNumber,
            vote: getHexNumber(consensus.QueryObtainedVotes(item.To).return) || '-',
            myVote: item.Count,
            lockDate: dayjs(item.VoteTimestamp).format('YYYY-MM-DD'),
            dueDate: dayjs(item.UnlockTimestamp).format('YYYY-MM-DD'),
            operation: {
                txId: item.TransactionId,
                publicKey: item.To,
                vote: true,
                redeem: dayjs(new Date()).unix() > dayjs(item.UnlockTimestamp).unix()
            }
        };
        dataList.push(data);
    });
    return {dataList, VotingRecordsCount};
}

