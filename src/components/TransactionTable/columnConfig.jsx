import { Spin, Tag, Tooltip } from "antd";
import { useState } from "react";
import Dividends from "../../components/Dividends";
import { aelf } from "../../utils";
import { Link } from "react-router-dom";
import addressFormat from "../../utils/addressFormat";
import { getFormattedDate } from "../../utils/timeUtils";
import StatusTag from "../../components/StatusTag/StatusTag";
import IconFont from "../../components/IconFont";
import { isPhoneCheck } from "../../utils/deviceCheck";

const PreviewCard = ({ info, text, price = { USD: 0 } }) => {
  const { quantity = 0, decimals, block_height } = info;
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
      amount = quantity / Math.pow(10, 8);
    }
  }

  return (
    <div className="previewer-card">
      <div className="title">
        <span>Additional Info</span>
        <a onClick={() => (location.href = `/tx/${text}`)}>
          See more Details <IconFont type="chakangengduojiantou" />
        </a>
      </div>
      <div className="bottom">
        <div className="status">
          <p className="label">Status:</p>
          <StatusTag status={info.tx_status} />
        </div>
        <div className="block">
          <p className="label">Block:</p>
          <div>
            <a onClick={() => (location.href = `/block/${info.block_height}`)}>
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
      width: isMobile ? 171 : 166,
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
      width: isMobile ? 100 : 111,
      render: (text) => {
        return <div className="method">{text}</div>;
      },
    },
    {
      dataIndex: "block_height",
      title: "Block",
      width: isMobile ? 75 : 85,
      render: (text) => {
        return (
          <div className="block">
            <Link to={`/block/${text}`} title={text}>
              {text}
            </Link>
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
      width: isMobile ? 140 : 132,
      render: (text) => {
        return <div>{getFormattedDate(text, timeFormat)}</div>;
      },
    },
    {
      dataIndex: "address_from",
      title: "From",
      width: isMobile ? 116 : 144,
      render: (text) => {
        return (
          <div className="address">
            <Link to={`/address/${text}`} title={addressFormat(text)}>
              {text}
            </Link>
            <IconFont type="right2" />
          </div>
        );
      },
    },
    {
      dataIndex: "address_to",
      title: "Interacted With (To)",
      width: isMobile ? 117 : 126,
      render: (text) => {
        return (
          <div className="address">
            <Link to={`/address/${text}`} title={addressFormat(text)}>
              {text}
            </Link>
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
            <Dividends dividends={JSON.parse(text)} />
          </div>
        );
      },
    },
  ];
};
