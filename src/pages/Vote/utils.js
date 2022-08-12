/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-26 15:46:27
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-26 16:03:10
 * @Description: utils (maybe) only use in Vote pages
 */
import moment from 'moment';

// todo: instead the code in page MyVote
export const getFormatedLockTime = (vote) => {
  // debugger
  console.log('vote', vote);
  const start = moment.unix(vote.voteTimestamp.seconds);
  const end = moment.unix(vote.unlockTimestamp.seconds);
  const formatedLockTime = end.from(start, true);
  return formatedLockTime;
};
