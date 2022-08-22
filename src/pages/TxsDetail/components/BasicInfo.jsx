import { Spin, Tag } from "antd";
import moment from "moment";
import React, { useMemo, useState } from "react";
import StatusTag from "../../../components/StatusTag/StatusTag";
import { getFormattedDate } from "../../../utils/timeUtils";
import Dividends from "../../../components/Dividends";
import { Link } from "react-router-dom";
import addressFormat from "../../../utils/addressFormat";
import {
  CONTRACT_VIEWER_URL,
  ELF_REALTIME_PRICE_URL,
} from "../../../constants";
import { useEffectOnce } from "react-use";
import { get } from "../../../utils";
import CopyButton from "../../../components/CopyButton/CopyButton";
import TokenTag from "./TokenTags/TokenTags";
import IconFont from "../../../components/IconFont";

export default function BasicInfo({
  info,
  parsedLogs,
  isDone,
  lastHeight,
  contractName,
}) {
  const [price, setPrice] = useState({ USD: 0 });

  const values = useMemo(() => {
    let value = {};
    const obj = Object.fromEntries(
      parsedLogs.map((item, index) => [
        index + "-" + item.symbol,
        Number(item.amount),
      ])
    );
    Object.keys(obj).forEach((key) => {
      const symbol = key.split("-")[1];
      if (value[symbol]) {
        value[symbol] += obj[key];
      } else {
        value = Object.assign(value, { [symbol]: obj[key] });
      }
    });
    return value;
  }, [parsedLogs]);

  const baseInfo = useMemo(
    () =>
      info &&
      lastHeight && [
        ["Transaction Hash", info.TransactionId],
        ["Status", <StatusTag status={info.Status} />],
        [
          "Block",
          <div className="value-block">
            <Link to={`/block/${info.BlockNumber}`} title={info.BlockNumber}>
              {info.BlockNumber}
            </Link>
            {lastHeight ? (
              <Tag
                className={lastHeight - info.BlockNumber < 0 && "unconfirmed"}
              >
                {lastHeight - info.BlockNumber > 0
                  ? `${lastHeight - info.BlockNumber} Block Confirmations`
                  : "Unconfirmed"}
              </Tag>
            ) : (
              <Spin />
            )}
          </div>,
        ],
        ["Block Hash", info.BlockHash],
        [
          "Timestamp",
          <div className="value-timestamp">
            <IconFont type="Time" />
            <span>
              {getFormattedDate(info.time)}(
              {moment(info.time).format("MMM-DD-YYYY hh:mm:SS A")})
            </span>
          </div>,
        ],
        ["Method", <Tag>{info.Transaction.MethodName}</Tag>],
      ],
    [lastHeight, info]
  );

  const addressInfo = useMemo(
    () =>
      info &&
      contractName && [
        [
          "From",
          <div className="value-address">
            <div>
              <Link
                to={`/address/${info.Transaction.From}`}
                title={addressFormat(info.Transaction.From)}
              >
                {addressFormat(info.Transaction.From)}
              </Link>
              <CopyButton value={addressFormat(info.Transaction.From)} />
            </div>
          </div>,
        ],
        [
          "Interacted With(To)",
          <div className="value-address">
            <div>
              <Link
                to={`/contract?#${decodeURIComponent(
                  CONTRACT_VIEWER_URL + info.Transaction.To
                )}`}
                title={addressFormat(info.Transaction.To)}
              >
                {addressFormat(info.Transaction.To)}
              </Link>
              <CopyButton value={addressFormat(info.Transaction.To)} />
            </div>
            {contractName && contractName !== info.Transaction.To && (
              <Tag>{contractName}</Tag>
            )}
          </div>,
        ],
      ],
    [contractName, info]
  );

  const tokenInfo = useMemo(
    () =>
      info &&
      values && [
        ["Value", <TokenTag values={values} isDone={isDone} price={price} />],
        ["Transaction Fee", <Dividends dividends={info.fee} />],
        ["Resources Fee", <Dividends dividends={info.resources} />],
      ],
    [values, info]
  );

  const renderList = useMemo(
    () => [
      ["base-info", baseInfo],
      ["address-info", addressInfo],
      ["token-info", tokenInfo],
    ],
    [baseInfo, addressInfo, tokenInfo]
  );

  useEffectOnce(() => {
    get(ELF_REALTIME_PRICE_URL).then((price) => setPrice(price));
  });

  return (
    <>
      {renderList.map((item) => (
        <div key={item[0]} className={`wrap ${item[0]}`}>
          {(item[1] || []).map((list, index) => {
            return (
              <div key={index} className="row">
                <p className="label">{list[0]} : </p>
                <div className="value">{list[1]}</div>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}
