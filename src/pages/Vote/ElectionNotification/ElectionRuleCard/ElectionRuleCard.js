import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

import './ElectionRuleCard.style.less';

export default memo(function ElectionRuleCard(props) {
  const { isCandidate, currentWallet } = props;
  return (
    <section className='election-rule-card'>
      <h2 className='election-header-title'>Node Election</h2>
      <div className='election-container'>
        <p className='election-intro'>
          Every token holder has the opportunity to become a BP node. However, in
          order to make our networks and communities operate more smoothly and
          effectively, we have developed a set of standards and regulations to
          make eligible people candidate nodes. We increased their chances of
          being elected by voting. We will vote on the new BP consensus node every
          week and publish the election results.
        </p>
        <p><a href=''>View the node election plan ></a></p>
        <div className='btn-group'>
          {/*<button className='view-node-election-plan-btn'>*/}
          {/*<a href=''>View the node election plan ></a>*/}
          {/*</button>*/}
          <Button type='primary' className='apply-to-be-a-node-btn'>
            {isCandidate ? (
              <Link
                to={{
                  pathname: '/vote/apply/keyin',
                  search: `pubkey=${currentWallet && currentWallet.pubkey}`
                }}
              >
                Modify team information
              </Link>
            ) : (
              <Link to='/vote/apply'>Become a candidate node</Link>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
});
