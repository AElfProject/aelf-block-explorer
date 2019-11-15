/**
 * @file Home.js
 * @author longyue, huangzongzhe
 */
/* eslint-disable fecs-camelcase */
import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { isArray } from 'zrender/lib/core/util';

import Button from './components/Button/Button';
import { DEFAUTRPCSERVER, SYMBOL, CHAIN_ID } from '../config/config';

dayjs.extend(relativeTime);

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'production';

const ALL_BLOCKS_API_URL = '/all/blocks';
const ALL_TXS_API_URL = '/all/transactions';
const TXS_BLOCK_API_URL = '/block/transactions';
const ADDRESS_TXS_API_URL = '/address/transactions';
const ADDRESS_BALANCE_API_URL = '/api/address/balance';
const TPS_LIST_API_URL = '/tps/list';
const ADDRESS_TOKENS_API_URL = '/address/tokens';
const ELF_REALTIME_PRICE_URL =
  'https://min-api.cryptocompare.com/data/price?fsym=ELF&tsyms=USD,BTC,CNY';
const ELF_REST_TRADE_API = 'https://www.bcex.top/Api_Market/getCoinTrade';
const RESOURCE_REALTIME_RECORDS = '/resource/realtime-records';
const RESOURCE_TURNOVER = '/resource/turnover';
const RESOURCE_RECORDS = '/resource/records';
const SOCKET_URL = '/socket';

const PAGE_SIZE = 25;
const ELF_DECIMAL = 100000000;
const TEMP_RESOURCE_DECIMAL = 100000;
// todo: use the code as follows
const TXSSTATUS = {
  // NotExisted: '不存在',
  // Pending: '交易中',
  // Failed: '失败',
  // Mined: '成功',
  NotExisted: 'NotExisted',
  Pending: 'Pending',
  Failed: 'Failed',
  Mined: 'Mined'
};

const IE_ADVICE =
  "We recommend using Chrome/Safari/Firefox to view our page. In recent time we don't support IE!";
const INPUT_STARTS_WITH_MINUS_TIP = "Input can't starts with minus symbol!";
const INPUT_ZERO_TIP = "Input can't be 0!";

// TODO 用户可选RPCSERVER
const RPCSERVER = DEFAUTRPCSERVER;

// TODO: Why is this undefined?
const BLOCKS_LIST_COLUMNS = [
  {
    title: 'Block Height',
    dataIndex: 'block_height',
    key: 'block_height',
    render: text => <Link to={`/block/${text}`}> {text} </Link>
  },
  {
    title: 'Age',
    dataIndex: 'time',
    key: 'time',
    render: time => (
      <span> {dayjs(time).format('YYYY/MM / DD HH: mm: ss ')} </span>
    )
    //     return <span> {dayjs().from(dayjs(time), true)} </span>;
  },
  {
    title: 'Number of Txs ',
    dataIndex: 'tx_count ',
    key: 'tx_count ',
    render: (text, row) =>
      !isNaN(+row.tx_count) && +row.tx_count !== 0 ? (
        <Link to={`/txs/block?${row.block_hash}`}> {row.tx_count} </Link>
      ) : (
        row.tx_count
      )
  }
];

const ALL_TXS_LIST_COLUMNS = [
  {
    title: 'Tx Id ',
    dataIndex: 'tx_id ',
    key: 'tx_id ',
    width: 400,
    ellipsis: true,
    render: (text, row) => (
      <Link to={`/tx/${row.tx_id}`} title={row.tx_id}>
        {row.tx_id}
      </Link>
    )
  },
  {
    title: 'Block Height ',
    dataIndex: 'block_height ',
    key: 'block_height ',
    width: 150,
    align: 'center',
    render: (text, row) => (
      <Link to={`/block/${row.block_height}`} title={row.block_height}>
        {' '}
        {row.block_height}{' '}
      </Link>
    )
  },
  {
    title: 'From ',
    dataIndex: 'address_from ',
    key: 'address_from ',
    // width: 300,
    ellipsis: true,
    render: (text, row) => (
      <Link to={`/address/${row.address_from}`} title={row.address_from}>
        {' '}
        {row.address_from}{' '}
      </Link>
    )
  },
  {
    title: null,
    key: 'payIcon ',
    width: 50,
    render: () => <Icon type='arrow-right' theme='outlined' />
  },
  {
    title: 'To ',
    dataIndex: 'address_to ',
    key: 'address_to ',
    ellipsis: true,
    render: (text, row) => (
      <Link to={`/address/${row.address_to}`} title={row.address_to}>
        {' '}
        {row.address_to}{' '}
      </Link>
    )
  }
  // {
  //     title: 'Quantity',
  //     dataIndex: 'quantity',
  //     key: 'quantity',
  //     render: text => <span>{text}</span>
  // }
];

const ADDRESS_INFO_COLUMN = [
  {
    title: 'address',
    dataIndex: 'address',
    key: 'address'
  },
  {
    title: 'balance',
    dataIndex: 'balance',
    key: 'balance'
  },
  {
    title: 'value',
    dataIndex: 'value',
    key: 'value'
  }
];

const RESOURCE_DETAILS_COLUMN = [
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    align: 'center',
    render: (text, row) => (
      <Link
        to={`/tx/${row.tx_id}`}
        title={dayjs(row.time).format('YYYY-MM-DD HH:mm:ss')}
      >
        {' '}
        {dayjs(row.time).format('YYYY-MM-DD HH:mm:ss')}
      </Link>
    )
  },
  {
    title: 'Resource type',
    dataIndex: 'resourceType',
    key: 'resourceType',
    align: 'center',
    render: (text, row) => (
      <Link to={`/tx/${row.tx_id}`} title={row.type}>
        {' '}
        {row.type}
      </Link>
    )
  },
  {
    title: 'Direction',
    dataIndex: 'direction',
    key: 'direction',
    align: 'center',
    render: (text, row) => (
      <Link to={`/tx/${row.tx_id}`} title={row.method}>
        {' '}
        {row.method === 'Buy' ? (
          <span style={{ color: '#007230' }}>Buy</span>
        ) : (
          <span style={{ color: '#a30100' }}>Sell</span>
        )}
      </Link>
    )
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
    align: 'center',
    render: (text, row) => {
      let price = 0;
      const fee = Math.ceil(row.fee / 1000);
      price = ((row.elf - fee) / row.resource).toFixed(9);
      return (
        <Link to={`/tx/${row.tx_id}`} title='price'>
          {price}
        </Link>
      );
    }
  },
  {
    title: 'Number',
    dataIndex: 'resource',
    key: 'number',
    align: 'center',
    render: (text, row) => (
      <Link to={`/tx/${row.tx_id}`} title={row.resource}>
        {' '}
        {row.resource}
      </Link>
    )
  },
  {
    title: 'ELF Number',
    dataIndex: 'elf',
    key: 'elfNumber',
    align: 'center',
    render: (text, row) => (
      <Link to={`/tx/${row.tx_id}`} title={row.elf}>
        {' '}
        {row.elf}
      </Link>
    )
  },
  {
    title: 'Service Charge',
    dataIndex: 'fee',
    key: 'serviceCharge',
    align: 'center',
    render: (text, row) => {
      const fee = Math.ceil(row.fee / 1000);
      return (
        <Link to={`/tx/${row.tx_id}`} title={fee}>
          {fee}
        </Link>
      );
    }
  },
  {
    title: 'Tx status',
    dataIndex: 'txStatus',
    key: 'txStatus',
    align: 'center',
    render: (text, row) => (
      <Link to={`/tx/${row.tx_id}`} title={row.tx_status}>
        {' '}
        {row.tx_status}
      </Link>
    )
  }
];

// button 判断是否可点击 在数据上做判断操作

export {
  ALL_BLOCKS_API_URL,
  ALL_TXS_API_URL,
  TXS_BLOCK_API_URL,
  ADDRESS_TXS_API_URL,
  ADDRESS_TOKENS_API_URL,
  TPS_LIST_API_URL,
  ELF_REALTIME_PRICE_URL,
  ELF_REST_TRADE_API,
  PAGE_SIZE,
  TXSSTATUS,
  RPCSERVER,
  BLOCKS_LIST_COLUMNS,
  ALL_TXS_LIST_COLUMNS,
  ADDRESS_INFO_COLUMN,
  RESOURCE_REALTIME_RECORDS,
  RESOURCE_TURNOVER,
  RESOURCE_RECORDS,
  RESOURCE_DETAILS_COLUMN,
  SYMBOL, // todo: get native token info
  CHAIN_ID, // todo: get chain status
  ELF_DECIMAL, // todo: similar to  get native token info
  TEMP_RESOURCE_DECIMAL,
  SOCKET_URL,
  IE_ADVICE,
  INPUT_STARTS_WITH_MINUS_TIP,
  INPUT_ZERO_TIP
};
