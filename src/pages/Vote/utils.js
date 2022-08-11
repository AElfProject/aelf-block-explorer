/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-26 15:46:27
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-26 16:03:10
 * @Description: utils (maybe) only use in Vote pages
 */
import { Modal } from 'antd';
import moment from 'moment';
import { NOT_CURRENT_CANDIDATE_TIP, THE_REASON_TO_BECOME_A_NON_CANDIDATE } from '../../constants';

// todo: instead the code in page MyVote
export const getFormatedLockTime = vote => {
  // debugger
  console.log('vote', vote);
  const start = moment.unix(vote.voteTimestamp.seconds);
  const end = moment.unix(vote.unlockTimestamp.seconds);
  const formatedLockTime = end.from(start, true);
  return formatedLockTime;
};


export const handleCannotVote = () => {
  Modal.confirm({
    content: (
      <>
        <h4 style={{ color: '#fff' }} className="text-wrap-container">
          {NOT_CURRENT_CANDIDATE_TIP}
        </h4>
        <p className="tip-color text-wrap-container">
          {THE_REASON_TO_BECOME_A_NON_CANDIDATE}
        </p>
      </>
    ),
    onOk: () => {
      // Use reload rather than refreshing the component as the voting button is on different pages. If we use refresh we need to confirm which part to refresh that will spent some developing time.
      window.location.reload();
    },
    centered: true,
    okText: 'Refresh'
  });
}
