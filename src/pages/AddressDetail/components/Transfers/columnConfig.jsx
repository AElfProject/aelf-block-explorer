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
import { CHAIN_ID } from "../../../../../config/config";

const CHAINS_LIST = CHAIN_STATE.chainItem;

const getAdd = (address, record) => {
  const { from, to, isCrossChain, relatedChainId } = record;
  let fromAddress;
  let toAddress;
  const chainsLink = CHAINS_LIST.find((ele) => {
    return ele.chainId === record.relatedChainId;
  })?.chainsLink.replace(/^\/+|\/+$/g, "");
  if (isCrossChain === "Transfer") {
    fromAddress = {
      complete: addressFormat(from, "", CHAIN_ID),
      hidden: addressFormat(hiddenAddress(from), "", CHAIN_ID),
    };
    if (from === address) {
      // this page
      fromAddress.all = `/address/${fromAddress.complete}${window.location.hash}`;
    } else {
      fromAddress.all = `/address/${fromAddress.complete}`;
    }
    // relatedChainId must different from CHAIN_ID
    toAddress = {
      complete: addressFormat(to, "", relatedChainId),
      hidden: addressFormat(hiddenAddress(to), "", relatedChainId),
      all: `${chainsLink}/address/${fromAddress.complete}`,
      isBlank: true,
    };
  } else if (isCrossChain === "Receive") {
    fromAddress = {
      complete: addressFormat(from, "", relatedChainId),
      hidden: addressFormat(hiddenAddress(from), "", relatedChainId),
      all: `${chainsLink}/address/${fromAddress.complete}`,
      isBlank: true,
    };
    toAddress = {
      complete: addressFormat(to, "", CHAIN_ID),
      hidden: addressFormat(hiddenAddress(to), "", CHAIN_ID),
    };
    if (to === address) {
      // this page
      toAddress.all = `/address/${toAddress.complete}${window.location.hash}`;
    } else {
      toAddress.all = `/address/${fromAddress.complete}`;
    }
  } else if (from === address) {
    fromAddress = {
      complete: addressFormat(from, "", CHAIN_ID),
      hidden: addressFormat(hiddenAddress(from), "", CHAIN_ID),
    };
    fromAddress.all = `/address/${fromAddress.complete}${window.location.hash}`;
    toAddress = {
      complete: addressFormat(to, "", CHAIN_ID),
      hidden: addressFormat(hiddenAddress(to), "", CHAIN_ID),
    };
    toAddress.all = `/address/${toAddress.complete}`;
  } else {
    // to === address
    fromAddress = {
      complete: addressFormat(from, "", CHAIN_ID),
      hidden: addressFormat(hiddenAddress(from), "", CHAIN_ID),
    };
    fromAddress.all = `/address/${fromAddress.complete}`;
    toAddress = {
      complete: addressFormat(to, "", CHAIN_ID),
      hidden: addressFormat(hiddenAddress(to), "", CHAIN_ID),
    };
    toAddress.all = `/address/${toAddress.complete}${window.location.hash}`;
  }
  return {
    fromAddress,
    toAddress,
  };
};

const checkIsOut = (address, record) => {
  const { from, to, isCrossChain } = record;
  if (isCrossChain === "Transfer" || isCrossChain === "no") {
    if (from === address) {
      return true;
    }
    return false;
  }
  // isCrossChain: Receive
  if (to === address) {
    return false;
  }
  return true;
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
        const isOut = checkIsOut(address, record);
        const { complete, hidden, all, isBlank } = getAdd(
          address,
          record
        ).fromAddress;
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
        const { complete, hidden, all, isBlank } = getAdd(
          address,
          record
        ).toAddress;
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
