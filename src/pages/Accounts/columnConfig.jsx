import { Tooltip } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import CopyButton from "../../components/CopyButton/CopyButton";
import addressFormat, { hiddenAddress } from "../../utils/addressFormat";
import { numberFormatter } from "../../utils/formater";

export default ({ isMobile, preTotal }) => {
  return [
    {
      title: "Rank",
      dataIndex: "id",
      width: isMobile ? 86 : 186,
      render(id, record, index) {
        return preTotal + index + 1;
      },
    },
    {
      title: "Address",
      dataIndex: "owner",
      width: isMobile ? 216 : 320,
      ellipsis: true,
      className: "color-blue",
      render: (text) => (
        <div className="address">
          <Tooltip
            title={addressFormat(text)}
            overlayInnerStyle={{ color: "#fff" }}
          >
            <Link
              to={`/address/${addressFormat(text)}`}
              title={addressFormat(text)}
            >
              {addressFormat(hiddenAddress(text))}
            </Link>
          </Tooltip>
          <CopyButton value={addressFormat(text)} />
        </div>
      ),
    },
    {
      title: "Balance",
      dataIndex: "balance",
      width: isMobile ? 156 : 300,
      render(balance, record) {
        return `${numberFormatter(balance)} ${record.symbol}`;
      },
    },
    {
      title: "Percentage",
      dataIndex: "percentage",
      width: isMobile ? 126 : 182,
    },
    {
      title: "Transfers",
      dataIndex: "count",
      align: "right",
      width: isMobile ? 76 : 100,
    },
  ];
};
