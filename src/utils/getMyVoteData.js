/**
 * @file getMyVoteData.js
 * @author zhouminghui
 * Get my voting list data
 */
import hexCharCodeToStr from './hexCharCodeToStr';
import getPublicKey from './getPublicKey';
import dayjs from 'dayjs';
import getHexNumber from './getHexNumber';

export default function getMyVoteData(currentWallet, startIndex, contracts) {
    let dataList = [];
    if (currentWallet) {
        if (currentWallet.address === '') {
            return {dataList, VotingRecordsCount: 0};
        }
    }
    else {
        return {dataList, VotingRecordsCount: 0};
    }
    
    const key = getPublicKey(currentWallet.publicKey);
    const consensus = contracts.consensus;
    const ticketsInfo = JSON.parse(
        hexCharCodeToStr(
            consensus.GetPageableNotWithdrawnTicketsInfoToFriendlyString(
                key, startIndex.page, startIndex.pageSize
            ).return
        )
    );
    const ticketsInfoList = ticketsInfo.VotingRecords || [];
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
                redeem: dayjs(new Date()).unix() < dayjs(item.UnlockTimestamp).unix()
            }
        };
        dataList.push(data);
    });
    return {dataList, VotingRecordsCount};
}

