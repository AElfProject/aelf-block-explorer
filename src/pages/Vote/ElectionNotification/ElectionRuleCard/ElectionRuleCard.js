/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2020-01-08 11:25:16
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2020-01-08 15:44:44
 * @Description: file content
 */
import React, { memo } from 'react';
import { withRouter } from 'react-router';
import { Button, Icon } from 'antd';

import './ElectionRuleCard.style.less';
import { isPhoneCheck } from '@utils/deviceCheck';

function ElectionRuleCard(props) {
  const { isCandidate, displayApplyModal, currentWallet } = props;

  const onClick = () => {
    if (isCandidate) {
      const { history } = props;
      history.push({
        pathname: '/vote/apply/keyin',
        search: `pubkey=${currentWallet && currentWallet.pubkey}`,
      });
    } else {
      displayApplyModal();
    }
  };

  const renderBtn = () => {
    // const isPhone = isPhoneCheck();
    // let btnHtml = null;
    // if (!isPhone)
    //   btnHtml = (
    //     <div className="btn-group">
    //       <Button
    //         // disabled="true"
    //         type="primary"
    //         className="apply-to-be-a-node-btn"
    //         onClick={onClick}
    //       >
    //         {isCandidate
    //           ? 'Modify team information'
    //           : 'Become a candidate node'}
    //       </Button>
    //     </div>
    //   );
    // return btnHtml;
    return (
      <div className="btn-group">
        <Button
          // disabled="true"
          type="primary"
          className="apply-to-be-a-node-btn"
          onClick={onClick}
        >
          {isCandidate
            ? 'Modify team information'
            : 'Become a candidate node'}
        </Button>
      </div>
    );
  };
  const btnHtml = renderBtn();

  return (
    <section className="election-rule-card">
      <h2 className="election-header-title">
        <Icon type="file-text" theme="filled" className="card-header-icon" />
        Node Election
      </h2>
      <div className="election-container">
        <p className="election-intro">
          Every token holder has the opportunity to become a BP node. However,
          in order to make our networks and communities operate more smoothly
          and effectively, we have developed a set of standards and regulations
          to make eligible people candidate nodes. We increased their chances of
          being elected by voting. We will vote on the new BP consensus node
          every week and publish the election results.
          {/* <a className="view-plan-link" href="">
            View the node election plan >
          </a> */}
        </p>
        {btnHtml}
      </div>
    </section>
  );
}

export default withRouter(memo(ElectionRuleCard));
