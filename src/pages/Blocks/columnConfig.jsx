import { Link } from "react-router-dom";
import React from "react";
import { Tooltip } from "antd";
import Dividends from "../../components/Dividends";
import { getFormattedDate } from "../../utils/timeUtils";
import IconFont from "../../components/IconFont";
import { isPhoneCheck } from "../../utils/deviceCheck";
import addressFormat, { hiddenAddress } from "../../utils/addressFormat";
import CopyButton from "../../components/CopyButton/CopyButton";

export default (timeFormat, handleFormatChange) => {
  const isMobile = isPhoneCheck();
  return [
    {
      dataIndex: "block_height",
      width: isMobile ? 117 : 187,
      title: "Block",
      render: (text) => {
        return (
          <div className="height">
            <Link to={`/block/${text}`} title={text}>
              {text}
            </Link>
          </div>
        );
      },
    },
    {
      dataIndex: "time",
      width: isMobile ? 140 : 228,
      title: (
        <div
          className="time"
          onClick={handleFormatChange}
          onKeyDown={handleFormatChange}
          role="presentation"
        >
          {timeFormat} <IconFont type="change" />
        </div>
      ),
      render: (text) => {
        return <div>{getFormattedDate(text, timeFormat)}</div>;
      },
    },
    {
      dataIndex: "tx_count",
      title: "Txns",
      width: isMobile ? 48 : 136,
      render: (text, record) => {
        return (
          <div>
            {!Number.isNaN(+record.tx_count) && +record.tx_count !== 0 ? (
              <Link to={`/block/${record.block_height}?tab=txns`}>
                {record.tx_count}
              </Link>
            ) : (
              record.tx_count
            )}
          </div>
        );
      },
    },
    {
      dataIndex: "block_hash",
      title: "Block Hash",
      width: isMobile ? 143 : 213,
      render: (text, record) => {
        return (
          <div className="block-hash">
            <Link title={text} to={`/block/${record.block_height}`}>
              {text}
            </Link>
          </div>
        );
      },
    },
    {
      dataIndex: "miner",
      title: "Miner",
      width: isMobile ? 180 : 180,
      render: (text) => {
        return (
          <div className="address">
            <Tooltip
              title={addressFormat(text)}
              overlayInnerStyle={{ color: "#fff" }}
            >
              <Link
                title={`${addressFormat(text)}`}
                to={`/address/${addressFormat(text)}`}
              >{`${addressFormat(hiddenAddress(text))}`}</Link>
            </Tooltip>
            <CopyButton value={addressFormat(text)} />
          </div>
        );
      },
    },
    {
      dataIndex: "dividends",
      title: "Reward",
      width: isMobile ? 80 : 136,
      render: (text) => {
        return (
          <div className="reward">
            <Dividends dividends={JSON.parse(text)} />
          </div>
        );
      },
    },
  ];
};
