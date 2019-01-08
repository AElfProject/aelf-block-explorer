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

export default function getVotingRecord(currentWallet) {
    let dataList = [];
    let key = 0;
    if (!currentWallet) {
        return dataList;
    }
    const wallet = getWallet(currentWallet.privateKey);
    const consensus = getConsensus(wallet);
    let votingRecordData = JSON.parse(
        hexCharCodeToStr(consensus.GetTicketsInfoToFriendlyString(currentWallet.publicKey).return)
    ).VotingRecords;
    if (votingRecordData) {
        for (let i = 0; i < votingRecordData.length; i++) {
            let data = {};
            data.key = key++;
            data.serialNumber = key;
            data.nodeName = hexCharCodeToStr(consensus.QueryAlias(votingRecordData[i].To).return);
            data.type = 'Vote';
            data.number = votingRecordData[i].Count;
            data.state = 'succed';
            data.time = formatUtcToDate(votingRecordData[i].VoteTimestamp);
            dataList.push(data);

            if (votingRecordData[i].IsWithdrawn) {
                data = {};
                data.key = key++;
                data.serialNumber = key;
                data.nodeName = hexCharCodeToStr(consensus.QueryAlias(votingRecordData[i].To).return);
                data.type = 'Redeem';
                data.number = votingRecordData[i].Count;
                data.state = 'succed';
                data.time = formatUtcToDate(votingRecordData[i].WithdrawTimestamp);
                dataList.push(data);
            }
        }
    }
    return dataList.reverse();
}
