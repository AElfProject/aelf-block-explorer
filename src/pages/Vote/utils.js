/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-26 15:46:27
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-26 16:03:10
 * @Description: utils (maybe) only use in Vote pages
 */
import moment from "moment";
import { fetchPageableCandidateInformation, fetchCount } from "@api/vote";

const TableItemCount = 20;

// todo: instead the code in page MyVote
export const getFormatedLockTime = (vote) => {
  const start = moment.unix(vote.voteTimestamp.seconds);
  const end = moment.unix(vote.unlockTimestamp.seconds);
  const formatedLockTime = end.from(start, true);
  return formatedLockTime;
};

const fetchTotal = async (electionContract) => {
  const res = await fetchCount(electionContract, "");
  const total = res.value?.length || 0;
  return total;
};

export const fetchAllCandidateInfo = async (electionContract) => {
  const total = await fetchTotal(electionContract);
  let start = 0;
  let result = [];
  while (start <= total) {
    // eslint-disable-next-line no-await-in-loop
    const res = await fetchPageableCandidateInformation(electionContract, {
      start,
      length: TableItemCount,
    });
    result = result.concat(res ? res.value : []);
    start += TableItemCount;
  }
  return result;
};
