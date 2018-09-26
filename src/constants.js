import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const ALL_BLOCKS_API_URL = "/all/blocks";
const ALL_TXS_API_URL = "/all/transactions";
const TXS_BLOCK_API_URL = "/block/transactions";
const ADDRESS_TXS_API_URL = "/address/transactions";
const ELF_REALTIME_PRICE_URL =
  "https://min-api.cryptocompare.com/data/price?fsym=ELF&tsyms=USD,BTC,CNY";
const ELF_REST_TRADE_API = "https://www.bcex.top/Api_Market/getCoinTrade";

const PAGE_SIZE = 25;
const TXSSTATUS = {
  NotExisted: "不存在",
  Pending: "交易中",
  Failed: "失败",
  Mined: "成功"
};
const RPCSERVER = "http://localhost:3000/chain";

const BLOCKS_LIST_COLUMNS = [
  {
    title: "高度",
    dataIndex: "block_height",
    key: "block_height",
    render: text => <Link to={`/block/${text}`}> {text} </Link>
  },
  {
    title: "块龄",
    dataIndex: "time",
    key: "time",
    render: time => <span> {dayjs().from(dayjs(time), true)} </span>
  },
  {
    title: "交易",
    dataIndex: "tx_count",
    key: "tx_count",
    render: (text, row) =>
      !isNaN(+text) && +text !== 0 ? (
        <Link to={`/txs/block?${row.block_hash}`}> {text} </Link>
      ) : (
        text
      )
  }
];

const ALL_TXS_LIST_COLUMNS = [
  {
    title: "交易哈希值",
    dataIndex: "tx_id",
    key: "tx_id",
    render: (text, row) => (
      <Link to={`/tx/${row.tx_id}`} title={text}>
        {text.slice(0, 17)}
        ...
      </Link>
    )
  },
  {
    title: "区块",
    dataIndex: "block_height",
    key: "block_height",
    render: text => (
      <Link to={`/block/${text}`} title={text}>
        {text}
      </Link>
    )
  },
  {
    title: "发送方",
    dataIndex: "address_from",
    key: "address_from",
    render: text => (
      <Link to={`/address/${text}`} title={text}>
        {text.slice(0, 17)}
        ...
      </Link>
    )
  },
  {
    title: null,
    key: "payIcon",
    render: () => <Icon type="arrow-right" theme="outlined" />
  },
  {
    title: "接收方",
    dataIndex: "address_to",
    key: "address_to"
    // render: text => (
    //   <Link to={`/address/${text}`} title={text}>
    //     {text.slice(0, 17)}
    //     ...
    //   </Link>
    // )
  }
];

const ADDRESS_INFO_COLUMN = [
  {
    title: "钱包地址",
    dataIndex: "address",
    key: "address"
  },
  {
    title: "余额",
    dataIndex: "balance",
    key: "balance"
  },
  {
    title: "价值",
    dataIndex: "value",
    key: "value"
  }
];

export {
  ALL_BLOCKS_API_URL,
  ALL_TXS_API_URL,
  TXS_BLOCK_API_URL,
  ADDRESS_TXS_API_URL,
  ELF_REALTIME_PRICE_URL,
  ELF_REST_TRADE_API,
  PAGE_SIZE,
  TXSSTATUS,
  RPCSERVER,
  BLOCKS_LIST_COLUMNS,
  ALL_TXS_LIST_COLUMNS,
  ADDRESS_INFO_COLUMN
};
