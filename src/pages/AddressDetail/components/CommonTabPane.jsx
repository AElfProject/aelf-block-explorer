import React from "react";
import NFTTransfers from "./NFTTransfers";
import Tokens from "./Tokens/Tokens";
import Transactions from "./Transactions/Transactions";
import Transfers from "./Transfers/Transfers";

export default function CommonTabPane({
  balances,
  prices,
  tokensLoading,
  address,
  tokenPagination,
}) {
  return [
    {
      key: "tokens",
      tab: "Tokens",
      children: (
        <Tokens
          balances={balances}
          prices={prices}
          dataLoading={tokensLoading}
          pagination={tokenPagination}
        />
      ),
    },
    {
      key: "transactions",
      tab: "Transactions",
      children: <Transactions address={address} />,
    },
    {
      key: "tokenTransfers",
      tab: "Token Transfers",
      children: <Transfers address={address} />,
    },
    {
      key: "nftTransfers",
      tab: "NFT Transfers",
      children: <NFTTransfers address={address} />,
    },
  ];
}
