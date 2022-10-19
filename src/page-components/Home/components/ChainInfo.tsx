import React, { useMemo } from 'react';
import IconFont from '../../../components/IconFont';
import { IRewardDto } from '../types';
interface IProps {
  blockHeight: number;
  localTransactions: number;
  reward: IRewardDto;
  unconfirmedBlockHeight: number | string;
  localAccounts: number;
}
export default function ChainInfo({
  blockHeight,
  localTransactions,
  reward,
  unconfirmedBlockHeight,
  localAccounts,
}: IProps) {
  const infoList = useMemo(
    () => [
      {
        icon: 'confirmedblocks',
        label: 'Confirmed Blocks',
        value: blockHeight.toLocaleString(),
      },
      {
        icon: 'transactions',
        label: 'Transactions',
        value: localTransactions.toLocaleString(),
      },
      {
        icon: 'reward',
        label: 'Reward',
        value: <p>{reward && (reward.ELF || 0).toLocaleString()} ELF</p>,
      },
      {
        icon: 'unconfirmedblocks',
        label: 'Unconfirmed Blocks',
        value: unconfirmedBlockHeight,
      },
      {
        icon: 'account',
        label: 'Accounts',
        value: localAccounts,
      },
      {
        icon: 'citizenwelfare',
        label: 'Citizen Welfare',
        value: <p>{reward && ((reward.ELF || 0) * 0.75).toLocaleString()} ELF</p>,
      },
    ],
    [blockHeight, localTransactions, reward, unconfirmedBlockHeight, localAccounts],
  );
  return (
    <>
      {infoList.map((item) => (
        <div key={item.label} className="card">
          <div className="left">
            <IconFont type={item.icon} />
          </div>
          <div className="right">
            <div className="label">{item.label}</div>
            <div className="value">{item.value}</div>
          </div>
        </div>
      ))}
    </>
  );
}
