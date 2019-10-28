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
import Button from './components/Button/Button';
import { DEFAUTRPCSERVER, SYMBOL, CHAIN_ID } from '../config/config';
import { isArray } from 'zrender/lib/core/util';
import { thousandsCommaWithDecimal } from '@utils/formater';

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
// todo: remove ELF_DECIMAL
const ELF_DECIMAL = 100000000;
const ELF_PRECISION = `${ELF_DECIMAL}`.length - 1;
const GENERAL_PRECISION = 2;
const RESOURCE_OPERATE_LIMIT = 0.01;
const TEMP_RESOURCE_DECIMAL = 100000;
const REAL_TIME_FETCH_INTERVAL = 1000 * 30;
const RESOURCE_CURRENCY_CHART_FETCH_INTERVAL = 1000 * 30;
const LONG_NOTIFI_TIME = 10; // s
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

const txStatusInUpperCase = {
  // NotExisted: '不存在',
  // Pending: '交易中',
  // Failed: '失败',
  // Mined: '成功',
  notExisted: 'NOT_EXISTED',
  pending: 'PENDING',
  failed: 'FAILED',
  mined: 'MINED'
};

const FAILED_MESSAGE_DISPLAY_TIME = 20; // seconds
// todo: use a object to gather all tip?
const IE_ADVICE =
  "We recommend using Chrome/Safari/Firefox to view our page. In recent time we don't support IE!";
const INPUT_STARTS_WITH_MINUS_TIP = "Input can't starts with minus symbol!";
const INPUT_ZERO_TIP = "Input can't be 0!";
const BALANCE_LESS_THAN_OPERATE_LIMIT_TIP = `Your balance is less than the operate limit ${RESOURCE_OPERATE_LIMIT}`;
const OPERATE_NUM_TOO_SMALL_TO_CALCULATE_REAL_PRICE_TIP =
  'Your operating number is too small.';
const BUY_OR_SELL_MORE_THAN_ASSETS_TIP =
  'Buy or sell more than available assets';
const BUY_OR_SELL_MORE_THAN_THE_INVENTORY_TIP =
  'Please purchase or sell a smaller amount of resources than the inventory in the resource contract.';
const TRANSACT_LARGE_THAN_ZERO_TIP =
  'You should transact an amount large than 0.';
const ONLY_POSITIVE_FLOAT_OR_INTEGER_TIP =
  'Only support positive float and interger.';
const CHECK_BALANCE_TIP = 'Please Check your balance Then.';
const BUY_MORE_THAN_HALT_OF_INVENTORY_TIP =
  'Sorry, you can not buy so many resources in one time.';
const INPUT_NUMBER_TIP = 'Your should input a number';
const BETWEEN_ZEOR_AND_BALANCE_TIP =
  'The value must be between 0 and your balance';
const SELECT_SOMETHING_TIP = 'Please select something to continue :)';
const NEED_PLUGIN_AUTHORIZE_TIP = "Need plugin's authorization.";
const UNKNOWN_ERROR_TIP =
  'Sorry, it seems that we encountered an unknown error.';
const NO_AUTHORIZATION_ERROR_TIP =
  "Sorry, you temporarily don't has the authorization to the page.";
const INPUT_SOMETHING_TIP = 'Sorry, you should input something:)';
const INTEGER_TIP = 'It can only be integer:)';
const UNLOCK_PLUGIN_TIP =
  'Your plugin has beed locked, please unlock and refresh the page:)';
const GET_TIP = 'It can only be integer:)';
const ALREADY_BEEN_CURRENT_CANDIDATE_TIP =
  'You already been candidate:)';
const GET_NULL = "Cannot read property 'error' of null";
const FEE_RATE = 0.005;
const SHORTEST_LOCK_TIME = 90; // day

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
    render: (text, row) => (
      <Link to={`/tx/${row.tx_id}`} title={row.tx_id}>
        {' '}
        {row.tx_id.slice(0, 17)}
        ...
      </Link>
    )
  },
  {
    title: 'Block Height ',
    dataIndex: 'block_height ',
    key: 'block_height ',
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
    render: () => <Icon type='arrow-right' theme='outlined' />
  },
  {
    title: 'To ',
    dataIndex: 'address_to ',
    key: 'address_to ',
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
          <span style={{ color: '#05ac90' }}>Buy</span>
        ) : (
          <span style={{ color: '#fe0030' }}>Sell</span>
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
      let price = '-';
      const { resource, method } = row;
      let { elf, fee } = row;
      elf /= ELF_DECIMAL;
      fee /= ELF_DECIMAL;
      price = ((method === 'Buy' ? elf + fee : elf - fee) / resource).toFixed(
        ELF_PRECISION
      );
      // const fee = Math.ceil(row.fee / 1000);
      // price = ((row.elf - fee) / row.resource).toFixed(9);
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
        {row.resource}
      </Link>
    )
  },
  {
    title: `${SYMBOL} Number`,
    dataIndex: 'elf',
    key: 'elfNumber',
    align: 'center',
    render: (text, row) => {
      const { method } = row;
      let { elf, fee } = row;
      let actualNumber = null;
      elf /= ELF_DECIMAL;
      fee /= ELF_DECIMAL;
      actualNumber = (method === 'Buy' ? elf + fee : elf - fee).toFixed(
        ELF_PRECISION
      );
      return (
        <Link to={`/tx/${row.tx_id}`} title={actualNumber}>
          {actualNumber}
        </Link>
      );
    }
  },
  {
    title: 'Service Charge',
    dataIndex: 'fee',
    key: 'serviceCharge',
    align: 'center',
    render: (text, row) => {
      // const fee = Math.ceil(row.fee / 1000);
      let { fee } = row;
      fee /= ELF_DECIMAL;
      return (
        <Link to={`/tx/${row.tx_id}`} title={fee}>
          {thousandsCommaWithDecimal(fee)}
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
  txStatusInUpperCase,
  RPCSERVER,
  BLOCKS_LIST_COLUMNS,
  ALL_TXS_LIST_COLUMNS,
  ADDRESS_INFO_COLUMN,
  RESOURCE_REALTIME_RECORDS,
  RESOURCE_TURNOVER,
  RESOURCE_RECORDS,
  RESOURCE_DETAILS_COLUMN,
  SOCKET_URL,
  IE_ADVICE,
  INPUT_STARTS_WITH_MINUS_TIP,
  INPUT_ZERO_TIP,
  BALANCE_LESS_THAN_OPERATE_LIMIT_TIP,
  OPERATE_NUM_TOO_SMALL_TO_CALCULATE_REAL_PRICE_TIP,
  BUY_OR_SELL_MORE_THAN_ASSETS_TIP,
  BUY_OR_SELL_MORE_THAN_THE_INVENTORY_TIP,
  TRANSACT_LARGE_THAN_ZERO_TIP,
  ONLY_POSITIVE_FLOAT_OR_INTEGER_TIP,
  CHECK_BALANCE_TIP,
  BUY_MORE_THAN_HALT_OF_INVENTORY_TIP,
  INPUT_NUMBER_TIP,
  BETWEEN_ZEOR_AND_BALANCE_TIP,
  SELECT_SOMETHING_TIP,
  NEED_PLUGIN_AUTHORIZE_TIP,
  UNKNOWN_ERROR_TIP,
  NO_AUTHORIZATION_ERROR_TIP,
  INPUT_SOMETHING_TIP,
  INTEGER_TIP,
  UNLOCK_PLUGIN_TIP,
  ALREADY_BEEN_CURRENT_CANDIDATE_TIP,
  GET_NULL,
  SHORTEST_LOCK_TIME,
  FAILED_MESSAGE_DISPLAY_TIME,
  SYMBOL, // todo: get native token info
  CHAIN_ID, // todo: get chain status
  ELF_DECIMAL, // todo: similar to  get native token info
  TEMP_RESOURCE_DECIMAL,
  ELF_PRECISION,
  GENERAL_PRECISION,
  RESOURCE_OPERATE_LIMIT,
  FEE_RATE,
  REAL_TIME_FETCH_INTERVAL,
  RESOURCE_CURRENCY_CHART_FETCH_INTERVAL,
  LONG_NOTIFI_TIME
};
