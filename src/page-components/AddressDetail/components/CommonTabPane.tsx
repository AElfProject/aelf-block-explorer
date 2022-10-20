import React from 'react';
import Tokens from './Tokens/Tokens';
import Transactions from './Transactions/Transactions';
import Transfers from './Transfers/Transfers';

export default function CommonTabPane({ balances, prices, tokensLoading, address, headers }) {
  return [
    {
      key: 'tokens',
      tab: 'Tokens',
      children: <Tokens balances={balances} prices={prices} dataLoading={tokensLoading} headers={headers} />,
    },
    {
      key: 'transactions',
      tab: 'Transactions',
      children: <Transactions address={address} />,
    },
    {
      key: 'transfers',
      tab: 'Transfers',
      children: <Transfers address={address} />,
    },
  ];
}
