/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2020-01-08 11:25:16
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2020-01-08 15:44:44
 * @Description: file content
 */
import React, { memo } from 'react';
import { withRouter } from 'next/router';
import { Button } from 'antd';
require('./ElectionRuleCard.style.less');
import { FileTextFilled } from '@ant-design/icons';
import Svg from 'components/Svg/Svg';

function ElectionRuleCard(props) {
  const router = props.router;
  const { isCandidate, displayApplyModal, currentWallet, quitElection } = props;

  const onClick = () => {
    if (isCandidate) {
      router.push(`/vote/apply/keyin?pubkey=${currentWallet && currentWallet.pubkey}`);
    } else {
      displayApplyModal();
    }
  };

  const renderBtn = () => (
    <div className="btn-group">
      <Button type="primary" className="apply-to-be-a-node-btn" onClick={onClick}>
        {isCandidate ? 'Modify team information' : 'Become a candidate node'}
      </Button>
      {isCandidate && (
        <div className="quit-button" onClick={quitElection}>
          Quit <Svg icon="quit" className="quit-logo" />
        </div>
      )}
    </div>
  );
  const btnHtml = renderBtn();

  return (
    <section className="election-rule-card">
      <h2 className="election-header-title">
        <FileTextFilled className="card-header-icon" />
        Node Election
      </h2>
      <div className="election-container">
        <p className="election-intro">
          Every token holder has the opportunity to become a BP node. However, in order to make our networks and
          communities operate more smoothly and effectively, we have developed a set of standards and regulations to
          make eligible people candidate nodes. We increased their chances of being elected by voting. We will vote on
          the new BP consensus node every week and publish the election results.
        </p>
        {btnHtml}
      </div>
    </section>
  );
}

export default withRouter(memo(ElectionRuleCard));