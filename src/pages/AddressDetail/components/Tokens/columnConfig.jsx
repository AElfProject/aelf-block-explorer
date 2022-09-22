import { Link } from "react-router-dom";
import React from "react";

export default ({ prices, isMobile }) => {
  return [
    {
      title: "Token Name",
      dataIndex: "symbol",
      width: isMobile ? 94 : 376,
      render(symbol) {
        return symbol ? <Link to={`/token/${symbol}`}>{symbol}</Link> : "-";
      },
    },
    {
      title: "Balance",
      dataIndex: "balance",
      width: isMobile ? 90 : 356,
      render(balance) {
        return Number(balance).toLocaleString(undefined, {
          maximumFractionDigits: 8,
        });
      },
    },
    {
      title: "Token Price",
      dataIndex: "symbol",
      width: isMobile ? 70 : 300,
      render(symbol) {
        if ((symbol, prices))
          return prices[symbol]
            ? `$${Number(prices[symbol]).toLocaleString()}`
            : "-";
        return "-";
      },
    },
    {
      title: "Value in USD",
      dataIndex: "symbol",
      align: "right",
      width: isMobile ? 70 : 136,
      render(symbol, record) {
        if ((symbol, prices))
          return prices[symbol]
            ? `$${(prices[symbol] * Number(record.balance)).toLocaleString()}`
            : "-";
        return "-";
      },
    },
  ];
};
