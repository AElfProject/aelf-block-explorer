import Dividends from "../../components/Dividends";
import { Link } from "react-router-dom";
import { getFormattedDate } from "../../utils/timeUtils";
import IconFont from "../../components/IconFont";
import { SYMBOL, CHAIN_ID } from "../../../config/config";
import { isPhoneCheck } from "../../utils/deviceCheck";

export default (timeFormat, handleFormatChange) => {
  const isMobile = isPhoneCheck();
  return [
    {
      dataIndex: "block_height",
      width: isMobile ? 101 : 160,
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
      width: isMobile ? 140 : 169,
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
      dataIndex: "tx_count",
      title: "Txns",
      width: isMobile ? 32 : 102,
      render: (text, record) => {
        return (
          <div>
            {!isNaN(+record.tx_count) && +record.tx_count !== 0 ? (
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
      width: isMobile ? 127 : 224,
      render: (text, record) => {
        return (
          <div className="address">
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
      width: isMobile ? 130 : 224,
      render: (text) => {
        return (
          <div className="address">
            <Link
              title={`${SYMBOL}_${text}_${CHAIN_ID}`}
              to={`/address/${text}`}
            >{`${SYMBOL}_${text}_${CHAIN_ID}`}</Link>
          </div>
        );
      },
    },
    {
      dataIndex: "dividends",
      title: "Reward",
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
