import React, { memo } from 'react';
import { withRouter } from 'react-router';
import { Button, Icon } from 'antd';

import './ElectionRuleCard.style.less';

function ElectionRuleCard(props) {
  const { isCandidate, displayApplyModal, currentWallet } = props;
  return (
    <section className="election-rule-card">
      <h2 className="election-header-title">
        <Icon
          type="file-text"
          theme="filled"
          className="card-header-icon"
        ></Icon>
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
          <a className="view-plan-link" href="">
            View the node election plan >
          </a>
        </p>
        <div className="btn-group">
          <Button
            type="primary"
            className="apply-to-be-a-node-btn"
            onClick={() => {
              if (isCandidate) {
                const { history } = props;
                history.push({
                  pathname: '/vote/apply/keyin',
                  search: `pubkey=${currentWallet && currentWallet.pubkey}`
                });
              } else {
                displayApplyModal();
              }
            }}
          >
            {isCandidate
              ? 'Modify team information'
              : 'Become a candidate node'}
          </Button>
        </div>
      </div>
    </section>
  );
}

export default withRouter(memo(ElectionRuleCard));
