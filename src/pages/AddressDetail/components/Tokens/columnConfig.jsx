import { Link } from "react-router-dom";
import React from "react";

export default ({ prices, isMobile }) => {
  return [
    {
      title: "Token Name",
      dataIndex: "symbol",
      width: isMobile ? 94 : 360,
      render(symbol) {
        return <Link to={`/token/${symbol}`}>{symbol}</Link>;
      },
    },
    {
      title: "Balance",
      dataIndex: "balance",
      width: isMobile ? 90 : 340,
      render(balance) {
        return Number(balance).toLocaleString();
      },
    },
    {
      title: "Token Price",
      dataIndex: "symbol",
      width: isMobile ? 70 : 284,
      render(symbol) {
        console.log(">>>", symbol, prices);
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
      width: isMobile ? 70 : 120,
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
