import React from "react";
import { Link } from "react-router-dom";

const getColumnConfig = (isMobile, preTotal) => {
  return [
    {
      title: "Rank",
      dataIndex: "id",
      width: isMobile ? 82 : 196,
      render(id, record, index) {
        return preTotal + index + 1;
      },
    },
    {
      title: "Token Name",
      dataIndex: "symbol",
      width: isMobile ? 96 : 180,
      render(symbol) {
        return <Link to={`/token/${symbol}`}>{symbol}</Link>;
      },
    },
    {
      title: "Total Supply",
      dataIndex: "totalSupply",
      width: isMobile ? 156 : 230,
      render(totalSupply, record) {
        return `${totalSupply} ${record.symbol}`;
      },
    },
    {
      title: "Circulating Supply",
      dataIndex: "supply",
      width: isMobile ? 156 : 260,
      render(supply, record) {
        return `${supply} ${record.symbol}`;
      },
    },
    {
      title: "Holders",
      dataIndex: "holders",
      width: isMobile ? 76 : 120,
    },
    {
      title: "Transfers",
      align: "right",
      dataIndex: "transfers",
      width: isMobile ? 76 : 86,
    },
  ];
};

export default getColumnConfig;
