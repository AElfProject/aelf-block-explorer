/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-10-22 20:57:24
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-10-22 21:11:09
 * @Description: file content
 */
// todo: maybe useless if contract change a lot in the future
import moment from 'moment';

export function filterUserVoteRecordsForOneCandidate(
  usersActiveVoteRecords,
  theCandidate,
) {
  return usersActiveVoteRecords.filter(
    (votingRecord) => votingRecord.candidate === theCandidate,
  );
}

export function computeUserRedeemableVoteAmountForOneCandidate(
  userVoteRecordsForOneCandidate,
) {
  const userRedeemableVoteAmountForOneCandidate = userVoteRecordsForOneCandidate
    .filter((record) => record.unlockTimestamp.seconds <= moment().unix())
    .reduce((total, current) => total + +current.amount, 0);
  return userRedeemableVoteAmountForOneCandidate;
}
