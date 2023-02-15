import React, { useMemo } from "react";
import IconFont from "../../../components/IconFont";

export default function ChainInfo({
  price,
  range,
  blockHeight,
  localTransactions,
  tpsData,
  reward,
  localAccounts,
}) {
  const infoList = useMemo(
    () => [
      {
        icon: "elfPrice",
        label: "ELF Price",
        value: range !== "-" && (
          <p>
            <span>$ {price.USD.toFixed(2)}</span>
            <span className={`range ${range >= 0 ? "rise" : "fall"}`}>
              ({range >= 0 ? "+" : ""}
              {range.toFixed(2)}%)
            </span>
          </p>
        ),
      },
      {
        icon: "transactions",
        label: "Transactions",
        value: (
          <p>
            <span>{(localTransactions / 1000000).toFixed(2)}M</span>
            <span className="tps">
              {tpsData ? `(${(tpsData / 60).toFixed(2)}TPS)` : ""}
            </span>
          </p>
        ),
      },
      {
        icon: "rewardDollar",
        label: "Reward",
        value: <p>{reward && (reward.ELF || 0).toLocaleString()} ELF</p>,
      },
      {
        icon: "unconfirmedblocks",
        label: "Last Block",
        value: blockHeight,
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
    [blockHeight, localTransactions, reward, localAccounts]
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
