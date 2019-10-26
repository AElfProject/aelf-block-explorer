import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

import './ElectionRuleCard.style.less';

export default memo(function ElectionRuleCard(props) {
  const { isCandidate, currentWallet } = props;
  return (
    <section className='election-rule-card'>
      <p className='election-intro'>
        每个代币持有者都有机会成为BP节点。然而，为了让网络和社区更加平稳有效地运作，我们制定了一套标准和规定，让符合条件的人成为候选节点。我们以投票的方式
        ，增加他们当选的机会。我们每周进行新一届BP共识节点投票，并公布选举结果。
      </p>
      <div className='btn-group'>
        <button className='view-node-election-plan-btn'>
          <a href=''>查看节点竞选计划书 ></a>
        </button>
        <Button type='primary' className='apply-to-be-a-node-btn'>
          {isCandidate ? (
            <Link
              to={{
                pathname: '/vote/apply/keyin',
                search: `pubkey=${currentWallet.pubkey}`
              }}
            >
              修改团队信息
            </Link>
          ) : (
            <Link to='/vote/apply'>成为候选节点</Link>
          )}
        </Button>
      </div>
    </section>
  );
});
