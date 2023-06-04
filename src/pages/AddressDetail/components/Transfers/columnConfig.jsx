/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { Tag, Tooltip } from "antd";
import { Img } from "react-image";
import CHAIN_STATE from "@config/configCMS.json";
import Dividends from "../../../../components/Dividends";
import IconFont from "../../../../components/IconFont";
import { getFormattedDate } from "../../../../utils/timeUtils";
import { numberFormatter } from "../../../../utils/formater";
import addressFormat, { hiddenAddress } from "../../../../utils/addressFormat";
import CopyButton from "../../../../components/CopyButton/CopyButton";
import { TOEKN_LIST } from "../../../../common/constants";

const CHAINS_LIST = CHAIN_STATE.chainItem;

const getAddress = (nowFlag, input, record) => {
  let complete = "";
  let hidden = "";
  let all = "";
  let isBlank = false;
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
    complete = addressFormat(input, "", record.relatedChainId);
    hidden = addressFormat(hiddenAddress(input), "", record.relatedChainId);
    const chainsLink = CHAINS_LIST.find((ele) => {
      return ele.chainId === record.relatedChainId;
    }).chainsLink.replace(/^\/+|\/+$/g, "");
    all = `${chainsLink}/address/${complete}`;
    isBlank = true;
  }
  return {
    complete,
    hidden,
    all,
    isBlank,
  };
};
const getColumnConfig = ({
  address,
  isMobile,
  timeFormat,
  handleFormatChange,
  ellipsis = true,
  withLogo = true,
}) => {
  return [
    {
      title: "Txn Hash",
      width: isMobile ? 120 : 140,
      ellipsis,
      dataIndex: "txId",
      render(hash) {
        return (
          <span className="txn-hash">
            <Link to={`/tx/${hash}`}>{hash}</Link>
          </span>
        );
      },
    },
    {
      dataIndex: "action",
      title: "Method",
      // mobile need longer than pc, padding is 16px, except first line
      width: isMobile ? 116 : 100,
      render: (text) => {
        return (
          <Tooltip title={text} overlayClassName="table-item-tooltip__white">
            <div className="method">{text}</div>
          </Tooltip>
        );
      },
    },
    {
      dataIndex: "time",
      width: isMobile ? 156 : 140,
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
      width: isMobile ? 224 : 196,
      render(from, record) {
        const isOut = from === address;
        const { complete, hidden, all, isBlank } = getAddress(
          isOut,
          from,
          record
        );
        return (
          <div className="from">
            <Tooltip
              title={complete}
              overlayClassName="table-item-tooltip__white"
            >
              {isBlank ? (
                <a target="_blank" href={all} rel="noreferrer">
                  {hidden}
                </a>
              ) : (
                <Link to={all}>{hidden}</Link>
              )}
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
      width: isMobile ? 176 : 160,
      ellipsis,
      render(to, record) {
        const isIn = to === address;
        const { complete, hidden, all, isBlank } = getAddress(isIn, to, record);
        return (
          <div className="to">
            <Tooltip
              title={complete}
              overlayClassName="table-item-tooltip__white"
            >
              {isBlank ? (
                <a target="_blank" href={all} rel="noreferrer">
                  {hidden}
                </a>
              ) : (
                <Link to={all}>{hidden}</Link>
              )}
            </Tooltip>
            <CopyButton value={complete} />
          </div>
        );
      },
    },
    {
      title: "Amount",
      dataIndex: "amount",
      width: isMobile ? 120 : 104,
      render(amount) {
        return `${numberFormatter(amount)}`;
      },
    },
    {
      title: "Token",
      dataIndex: "symbol",
      width: isMobile ? 96 : 80,
      render(symbol) {
        const defaultIcon = (
          <span className="default-icon">
            {symbol.slice(0, 1).toUpperCase()}
          </span>
        );
        const { logoURI } =
          TOEKN_LIST.find((ele) => ele.symbol === symbol) || {};
        const logoFragment = logoURI ? (
          <Img alt="logo" src={logoURI} unloader={defaultIcon} />
        ) : (
          defaultIcon
        );
        return (
          <div className="token">
            {withLogo ? logoFragment : ""}
            {symbol}
          </div>
        );
      },
    },
    {
      title: "Txn Fee",
      dataIndex: "txFee",
      align: "right",
      width: isMobile ? 136 : 120,
      render(fee) {
        return <Dividends dividends={fee} />;
      },
    },
  ];
};

export default getColumnConfig;
