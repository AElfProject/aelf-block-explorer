import { Link } from "react-router-dom";
import React from "react";
import { numberFormatter } from "../../../../utils/formater";

export default ({ prices, isMobile }) => {
  return [
    {
      title: "Token Name",
      dataIndex: "symbol",
      width: isMobile ? 94 : 376,
      render(symbol, record) {
        return symbol ? <Link to={`/token/${symbol}`}>{record.symbolAlias || symbol}</Link> : "-";
      },
    },
    {
      title: "Balance",
      dataIndex: "balance",
      width: isMobile ? 90 : 356,
      render(balance) {
        return numberFormatter(balance);
      },
    },
    {
      title: "Token Price",
      dataIndex: "symbol",
      width: isMobile ? 70 : 300,
      render(symbol) {
        if (symbol && prices)
          return prices[symbol] ? `$${numberFormatter(prices[symbol])}` : "-";
        return "-";
      },
    },
    {
      title: "Value in USD",
      dataIndex: "symbol",
      align: "right",
      width: isMobile ? 70 : 136,
      render(symbol, record) {
        if (symbol && prices)
          return prices[symbol]
            ? `$${numberFormatter(prices[symbol] * record.balance)}`
            : "-";
        return "-";
      },
    },
  ];
};
