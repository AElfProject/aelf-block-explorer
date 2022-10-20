import React from 'react';
import Contract from './Contract/Contract';
import Events from './Events/Events';
import History from './History/History';

export default function ContractTabPane({ contractInfo, contractHistory, address, codeHash, activeKey }) {
  return [
    {
      key: 'contract',
      tab: 'Contract',
      children: (
        <Contract
          contractInfo={contractInfo}
          codeHash={codeHash}
          history={contractHistory}
          isShow={activeKey === 'contract'}
        />
      ),
    },
    {
      key: 'events',
      tab: 'Events',
      children: <Events address={address} />,
    },
    {
      key: 'history',
      tab: 'History',
      children: <History history={contractHistory} />,
    },
  ];
}
