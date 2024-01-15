/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable camelcase */
import { Spin, Tag, Tooltip } from "antd";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Dividends from "../Dividends";
import { aelf } from "../../utils";
import addressFormat, { hiddenAddress } from "../../utils/addressFormat";
import { getFormattedDate } from "../../utils/timeUtils";
import StatusTag from "../StatusTag/StatusTag";
import IconFont from "../IconFont";
import { isPhoneCheck } from "../../utils/deviceCheck";
import CopyButton from "../CopyButton/CopyButton";

const PreviewCard = ({ info, text, price = { USD: 0 } }) => {
  const nav = useNavigate();
  const { quantity = 0, block_height } = info;
  const [confirmations, setConfirmations] = useState(0);
  const [lastBlockLoading, setLastBlockLoading] = useState(true);
  aelf.chain.getChainStatus().then(({ LastIrreversibleBlockHeight }) => {
    setConfirmations(LastIrreversibleBlockHeight - block_height);
    setLastBlockLoading(false);
  });
  let amount = "-";
  if (quantity) {
    // 1e-7
    if (quantity <= 99) {
      amount = `0.000000${quantity}`;
    } else if (quantity <= 9) {
      amount = `0.0000000${quantity}`;
    } else {
      amount = quantity / 10 ** 8;
    }
  }

  return (
    <div className="previewer-card">
      <div className="title">
        <span>Additional Info</span>
        <a
          onClick={() => {
            nav(`/tx/${text}`);
          }}
        >
          See more Details <IconFont type="chakangengduojiantou" />
        </a>
      </div>
      <div className="bottom">
        <div className="status">
          <p className="label">Status:</p>
          <StatusTag status={info.tx_status || "MINED"} />
        </div>
        <div className="block">
          <p className="label">Block:</p>
          <div>
            <a onClick={() => nav(`/block/${info.block_height}`)}>
              {info.block_height}
            </a>
            {!lastBlockLoading ? (
              <Tag className={confirmations < 0 && "unconfirmed"}>
                {confirmations >= 0
                  ? `${confirmations} Block Confirmations`
                  : "Unconfirmed"}
              </Tag>
            ) : (
              <Spin />
            )}
          </div>
        </div>
        <div className="value">
          <p className="label">Value:</p>
          {quantity ? (
            <Tag>
              {amount}ELF
              <span>$({`${(price.USD * Number(amount)).toFixed(2)}`})</span>
            </Tag>
          ) : (
            "--"
          )}
        </div>
      </div>
    </div>
  );
};

export default (timeFormat, price, handleFormatChange) => {
  const isMobile = isPhoneCheck();
  return [
    {
      dataIndex: "tx_id",
      width: isMobile ? 171 : 206,
      title: "Txn Hash",
      render: (text, record) => {
        return (
          <div className="id">
            <Tooltip
              trigger="click"
              title={() => (
                <PreviewCard info={record} price={price} text={text} />
              )}
              arrowPointAtCenter
              overlayClassName={`transaction-tooltip ${isMobile && "mobile"}`}
              color="white"
              placement="right"
            >
              <IconFont type="Eye-on" />
            </Tooltip>
            <Link to={`/tx/${text}`} title={text}>
              {text}
            </Link>
          </div>
        );
      },
    },
    {
      dataIndex: "method",
      title: "Method",
      width: isMobile ? 120 : 150,
      render: (text) => {
        return (
          <Tooltip title={text} overlayClassName="table-item-tooltip__white">
            <div className="method">{text}</div>
          </Tooltip>
        );
      },
    },
    {
      dataIndex: "block_height",
      title: "Block",
      width: isMobile ? 75 : 144,
      render: (text) => {
        return (
          <div className="block">
            <Link to={`/block/${text}`}>{text}</Link>
          </div>
        );
      },
    },
    {
      dataIndex: "time",
      title: (
        <div className="time" onClick={handleFormatChange}>
          {timeFormat} <IconFont type="change" />
        </div>
      ),
      width: isMobile ? 140 : 162,
      render: (text) => {
        return <div>{getFormattedDate(text, timeFormat)}</div>;
      },
    },
    {
      dataIndex: "address_from",
      title: "From",
      width: isMobile ? 200 : 200,
      render: (text) => {
        return (
          <div className="address">
            {text ? (
              <>
                <Tooltip
                  title={addressFormat(text)}
                  overlayClassName="table-item-tooltip__white"
                >
                  <Link to={`/address/${addressFormat(text)}`}>
                    <span>{addressFormat(hiddenAddress(text))}</span>
                  </Link>
                </Tooltip>
                <CopyButton value={addressFormat(text)} />
              </>
            ) : (
              "-"
            )}
            <IconFont type="right2" />
          </div>
        );
      },
    },
    {
      dataIndex: "address_to",
      title: "Interacted With (To)",
      width: isMobile ? 185 : 185,
      render: (text) => {
        return (
          <div className="address">
            {text ? (
              <>
                <Tooltip
                  title={addressFormat(text)}
                  overlayClassName="table-item-tooltip__white"
                >
                  <Link to={`/address/${addressFormat(text)}`}>
                    {addressFormat(hiddenAddress(text))}
                  </Link>
                </Tooltip>

                <CopyButton value={addressFormat(text)} />
              </>
            ) : (
              "-"
            )}
          </div>
        );
      },
    },
    {
      dataIndex: "tx_fee",
      title: "Txn Fee",
      width: 102,
      render: (text) => {
        return (
          <div className="fee">
            <Dividends dividends={JSON.parse(text || "{}")} />
          </div>
        );
      },
    },
  ];
};
