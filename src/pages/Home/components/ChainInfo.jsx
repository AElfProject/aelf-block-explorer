import React, { useMemo } from "react";
import Dividends from "../../../components/Dividends";
import IconFont from "../../../components/IconFont";

export default function ChainInfo({
  blockHeight,
  localTransactions,
  reward,
  unconfirmedBlockHeight,
  localAccounts,
}) {
  const infoList = useMemo(
    () => [
      {
        icon: "confirmedblocks",
        label: "Confirmed Blocks",
        value: blockHeight.toLocaleString(),
      },
      {
        icon: "transactions",
        label: "Transactions",
        value: localTransactions.toLocaleString(),
      },
      {
        icon: "reward",
        label: "Reward",
        value: <p>{reward && (reward.ELF || 0).toLocaleString()} ELF</p>,
      },
      {
        icon: "unconfirmedblocks",
        label: "Unconfirmed Blocks",
        value: unconfirmedBlockHeight,
      },
      {
        icon: "account",
        label: "Accounts",
        value: localAccounts,
      },
      {
        icon: "citizenwelfare",
        label: "Citizen Welfare",
        value: (
          <p>{reward && ((reward.ELF || 0) * 0.75).toLocaleString()} ELF</p>
        ),
      },
    ],
    [
      blockHeight,
      localTransactions,
      reward,
      unconfirmedBlockHeight,
      localAccounts,
    ]
  );
  return (
    <>
      {infoList.map((item) => (
        <div key={item.label} className="card">
          <div className="left">
            <IconFont type={item.icon} />
          </div>
          <div className="right">
            <p className="label">{item.label}</p>
            <p className="value">{item.value}</p>
          </div>
        </div>
      ))}
    </>
  );
}
