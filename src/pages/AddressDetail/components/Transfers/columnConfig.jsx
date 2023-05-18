/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { Tag, Tooltip } from "antd";
import CHAIN_STATE from "@config/configCMS.json";
import Dividends from "../../../../components/Dividends";
import IconFont from "../../../../components/IconFont";
import { getFormattedDate } from "../../../../utils/timeUtils";
import { numberFormatter } from "../../../../utils/formater";
import addressFormat, { hiddenAddress } from "../../../../utils/addressFormat";
import CopyButton from "../../../../components/CopyButton/CopyButton";

const CHAINS_LIST = CHAIN_STATE.chainItem;

const getAddress = (address, nowFlag, input, record) => {
  let complete = "";
  let hidden = "";
  let all = "";
  if (nowFlag) {
    complete = addressFormat(input);
    hidden = addressFormat(hiddenAddress(input));
    // this page
    all = `/address/${complete}${window.location.hash}`;
  } else if (record.isCrossChain === "no") {
    complete = addressFormat(input);
    hidden = addressFormat(hiddenAddress(input));
    all = `/address/${complete}`;
  } else {
    // isCrossChain
    complete = addressFormat(input, record.relatedChainId);
    hidden = addressFormat(
      hiddenAddress(input),
      record.symbol,
      record.relatedChainId
    );
    const chainsLink = CHAINS_LIST.find((ele) => {
      return ele.chainId !== record.relatedChainId;
    }).chainsLink.replace(/^\/+|\/+$/g, "");
    all = `${chainsLink}/address/${complete}`;
  }
  return {
    complete,
    hidden,
    all,
  };
};
const getColumnConfig = ({
  address,
  isMobile,
  timeFormat,
  handleFormatChange,
  ellipsis = true,
}) => {
  return [
    {
      title: "Txn Hash",
      width: isMobile ? 149 : 206,
      ellipsis,
      dataIndex: "txId",
      className: "color-blue",
      render(hash) {
        return <Link to={`/tx/${hash}`}>{hash}</Link>;
      },
    },
    {
      dataIndex: "action",
      title: "Method",
      width: isMobile ? 110 : 110,
      render: (text) => {
        return (
          <Tooltip title={text} overlayInnerStyle={{ color: "#fff" }}>
            <div className="method">{text}</div>
          </Tooltip>
        );
      },
    },
    {
      dataIndex: "time",
      width: isMobile ? 120 : 120,
      title: (
        <div className="time" onClick={handleFormatChange}>
          {timeFormat} <IconFont type="change" />
        </div>
      ),
      render: (text) => {
        return <div>{getFormattedDate(text, timeFormat)}</div>;
      },
    },
    {
      title: "From",
      dataIndex: "from",
      width: isMobile ? 200 : 200,
      className: "color-blue",
      render(from, record) {
        const isOut = from === address;
        const { complete, hidden, all } = getAddress(
          address,
          isOut,
          from,
          record
        );
        return (
          <div className="from">
            <Tooltip title={complete} overlayInnerStyle={{ color: "#fff" }}>
              <Link to={all}>{hidden}</Link>
            </Tooltip>
            <CopyButton value={complete} />
            <Tag className={clsx(isOut ? "out" : "in")}>
              {isOut ? "OUT" : "IN"}
            </Tag>
          </div>
        );
      },
    },
    {
      title: "Interacted With (To )",
      dataIndex: "to",
      width: isMobile ? 175 : 175,
      ellipsis,
      className: "color-blue",
      render(to, record) {
        const isIn = to === address;
        const { complete, hidden, all } = getAddress(address, isIn, to, record);
        return (
          <div className="to">
            <Tooltip title={complete} overlayInnerStyle={{ color: "#fff" }}>
              <Link to={all}>{hidden}</Link>
            </Tooltip>
            <CopyButton value={complete} />
          </div>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: isMobile ? 50 : 50,
      render(amount) {
        return `${numberFormatter(amount)}`;
      },
    },
    {
      title: "Token",
      dataIndex: "symbol",
      width: isMobile ? 50 : 50,
      render(symbol) {
        return `${symbol}`;
      },
    },
    {
      title: "Txn Fee",
      dataIndex: "txFee",
      align: "right",
      width: isMobile ? 50 : 50,
      render(fee) {
        return <Dividends dividends={fee} />;
      },
    },
  ];
};

export default getColumnConfig;
