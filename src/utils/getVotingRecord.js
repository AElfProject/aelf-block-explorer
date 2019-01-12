/**
 * @file getVotingRecord
 * @author zhouminghui
 * 获取投票记录
*/

import getWallet from './getWallet';
import getConsensus from './getConsensus';
import hexCharCodeToStr from './hexCharCodeToStr';
import dayjs from 'dayjs';

// Data formatted format
// const data = [
//     {
//         key: '1',
//         serialNumber: '1',
//         nodeName: 'aelf-hdbo-5678',
//         type: '赎回',
//         number: '2000',
//         state: '成功',
//         time: '2018-11-11'
//     }
// ];

export default function getVotingRecord(currentWallet, startIndex, CONSENSUSADDRESS) {
    let dataList = [];
    if (!currentWallet) {
        return dataList;
    }
    const wallet = getWallet(currentWallet.privateKey);
    const consensus = getConsensus(CONSENSUSADDRESS, wallet);
    let ticketsHistoriesData = JSON.parse(
        hexCharCodeToStr(
            consensus.GetPageableTicketsHistoriesToFriendlyString(
                currentWallet.publicKey, startIndex.page, startIndex.pageSize
            ).return
        )
    );
    const historiesNumber = ticketsHistoriesData.HistoriesNumber;
    let values = ticketsHistoriesData.Values || [];
    values.map((item, index) => {
        let data = {
            key: startIndex.page + index + 1,
            serialNumber: startIndex.page + index + 1,
            nodeName: item.CandidateAlias || '-',
            type: item.Type || '-',
            number: item.VotesNumber || '-',
            state: item.State ? 'success' : 'failed',
            time: dayjs(item.Timestamp).format('YYYY-MM-DD') || '-'
        };
        dataList.push(data);
    });
    return {dataList, historiesNumber};
}