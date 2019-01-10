/**
 * @file getVotingRecord
 * @author zhouminghui
 * 获取投票记录
*/

import getWallet from './getWallet';
import getConsensus from './getConsensus';
import hexCharCodeToStr from './hexCharCodeToStr';
import formatUtcToDate from './formatUtcToDate';
// const data = [
//     {
//         key: '1',
//         serialNumber: '1',
//         nodeName: 'aelf-hdbo-5678',
//         type: '赎回',
//         number: '2000',
//         state: '成功',
//         time: '2018-11-11'
//     },
//     {
//         key: '2',
//         serialNumber: '2',
//         nodeName: 'aelf-hdbo-1234',
//         type: '投票',
//         number: '30',
//         state: '成功',
//         time: '2018-11-11'
//     }
// ];

export default function getVotingRecord(currentWallet, startIndex) {
    let dataList = [];
    if (!currentWallet) {
        return dataList;
    }
    const wallet = getWallet(currentWallet.privateKey);
    const consensus = getConsensus(wallet);
    let ticketsHistoriesData = JSON.parse(
        hexCharCodeToStr(
            consensus.GetPageableTicketsHistoriesToFriendlyString(
                currentWallet.publicKey, startIndex.page, startIndex.pageSize
            ).return
        )
    );
    console.log(ticketsHistoriesData);
    const historiesNumber = ticketsHistoriesData.HistoriesNumber;
    if (ticketsHistoriesData.Values) {
        const ticketsList = ticketsHistoriesData.Values;
        for (let i = 0; i < ticketsList.length; i++) {
            const ticketsData = ticketsList[i];
            let data = {
                key: startIndex.page + i + 1,
                serialNumber: startIndex.page + i + 1,
                nodeName: ticketsData.CandidateAlias || '-',
                type: ticketsData.Type || '-',
                number: ticketsData.VotesNumber || '-',
                state: ticketsData.State ? 'success' : 'failed',
                time: formatUtcToDate(ticketsData.Timestamp) || '-'
            };
            dataList.push(data);
        }

    }
    return {dataList, historiesNumber};
}