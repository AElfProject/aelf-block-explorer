import { DEFAUTRPCSERVER, SYMBOL, CHAIN_ID } from './config/config';
import Link from 'next/link';
import React from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import addressFormat from '../utils/addressFormat';
import Dividends from '../components/Dividends';
import { ArrowRightOutlined } from '@ant-design/icons';
import { removeAElfPrefix } from '../utils/utils';
dayjs.extend(relativeTime);
import BigNumber from 'bignumber.js';

// for address
const globalConfig = {
  isMobile: false,
};
export const GlobalContext = React.createContext(globalConfig);
export const Contracts = React.createContext({});

// todo: Use the variable in less instead
export const PRIMARY_COLOR = '#266CD3';

export const LANG_MAX = new BigNumber('9223372036854774784');

export const ZERO = new BigNumber(0);
export const ONE = new BigNumber(1);

export const isEffectiveNumber = (v: any) => {
  const val = new BigNumber(v);
  return !val.isNaN() && !val.lte(0);
};

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'AppName';
export const prefixCls = process.env.NEXT_PUBLIC_CSS_APP_PREFIX;

export const MaxUint256 = '115792089237316195423570985008687907853269984665640564039457584007913129639935';

const LOWER_SYMBOL = SYMBOL?.toLocaleLowerCase();
const PAGE_SIZE = 25;
// todo: remove ELF_DECIMAL
const ELF_DECIMAL = 100000000;
const ELF_PRECISION = `${ELF_DECIMAL}`.length - 1;
const GENERAL_PRECISION = 2;
const TEMP_RESOURCE_DECIMAL = 100000;
const REAL_TIME_FETCH_INTERVAL = 1000 * 10;
const RESOURCE_CURRENCY_CHART_FETCH_INTERVAL = 1000 * 60;
const LONG_NOTIFI_TIME = 10; // s
// TODO 用户可选RPCSERVER
const RPCSERVER = DEFAUTRPCSERVER;
// TODO: Why is this undefined?

const BLOCKS_LIST_COLUMNS = [
  {
    title: 'Height',
    dataIndex: 'block_height',
    key: 'block_height',
    width: 150,
    render: (text: string) => <Link href={`/block/${text}`}> {text} </Link>,
  },
  {
    title: 'Block Hash',
    dataIndex: 'block_hash',
    key: 'block_hash',
    width: 280,
    ellipsis: true,
    render: (text: string, row: any) => (
      <Link title={text} href={`/block/${row.block_height}`}>
        {' '}
        {text}{' '}
      </Link>
    ),
  },
  {
    title: 'Miner',
    dataIndex: 'miner',
    key: 'miner',
    width: 280,
    ellipsis: true,
    render(text: string) {
      return (
        <Link title={`${SYMBOL}_${text}_${CHAIN_ID}`} href={`/address/${text}`}>{`${SYMBOL}_${text}_${CHAIN_ID}`}</Link>
      );
    },
  },
  {
    title: 'Dividends',
    dataIndex: 'dividends',
    key: 'dividends',
    width: 120,
    render(text: string) {
      return <Dividends dividends={JSON.parse(text)} />;
    },
  },
  {
    title: 'Txs',
    dataIndex: 'tx_count ',
    key: 'tx_count ',
    width: 60,
    render: (text: string, row: any) =>
      !isNaN(+row.tx_count) && +row.tx_count !== 0 ? (
        <Link href={`/txs/block?${row.block_hash}`}>
          {' '}
          <>{row.tx_count}</>{' '}
        </Link>
      ) : (
        row.tx_count
      ),
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    render: (time: string) => <span> {dayjs(time).format('YYYY/MM/DD HH:mm:ss')} </span>,
    //     return <span> {dayjs().from(dayjs(time), true)} </span>;
  },
];

const ALL_TXS_LIST_COLUMNS = [
  {
    title: 'Tx Id',
    dataIndex: 'tx_id',
    key: 'tx_id',
    width: 300,
    ellipsis: true,
    render: (text: string, row: any) => (
      <Link href={`/tx/${row.tx_id}`} title={row.tx_id}>
        {row.tx_id}
      </Link>
    ),
  },
  {
    title: 'Height',
    dataIndex: 'block_height',
    key: 'block_height',
    width: 150,
    align: 'center',
    render: (text: string, row: any) => (
      <Link href={`/block/${row.block_height}`} title={row.block_height}>
        {' '}
        {row.block_height}{' '}
      </Link>
    ),
  },
  {
    title: 'From ',
    dataIndex: 'address_from',
    key: 'address_from',
    ellipsis: true,
    render: (text: string) => (
      <Link href={`/address/${text}`} title={addressFormat(text)}>
        {' '}
        {addressFormat(text)}
      </Link>
    ),
  },
  {
    title: null,
    key: 'payIcon',
    width: 50,
    render: () => <ArrowRightOutlined />,
  },
  {
    title: 'To',
    dataIndex: 'address_to',
    key: 'address_to',
    ellipsis: true,
    render: (text: string, row: any) => {
      const { contractName, isSystemContract } = row.contractName || {};
      const name = isSystemContract ? removeAElfPrefix(contractName) : contractName;
      return (
        <Link href={`/contract/${text}`} title={addressFormat(text)}>
          {name || addressFormat(text)}
        </Link>
      );
    },
  },
  {
    title: 'Method',
    dataIndex: 'method',
    key: 'method',
    ellipsis: true,
  },
  {
    title: 'Tx Fee',
    dataIndex: 'tx_fee',
    key: 'tx_fee',
    render(text: string) {
      return <Dividends dividends={JSON.parse(text)} />;
    },
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
    render: (_: any, row: any) => {
      let amount = '-';
      let symbol;
      if (row.quantity && row.decimals) {
        // 1e-7
        if (row.quantity <= 99) {
          amount = `0.000000${row.quantity}`;
        } else if (row.quantity <= 9) {
          amount = `0.0000000${row.quantity}`;
        } else {
          amount = '' + row.quantity / Math.pow(10, row.decimals);
        }
      }
      if (row.symbol) {
        symbol = `(${row.symbol})`;
      }
      return (
        <span>
          {amount}
          {symbol}
        </span>
      );
    },
  },
];

const ADDRESS_INFO_COLUMN = [
  {
    title: 'address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'balance',
    dataIndex: 'balance',
    key: 'balance',
  },
  {
    title: 'value',
    dataIndex: 'value',
    key: 'value',
  },
];

const RESOURCE_DETAILS_COLUMN = [
  {
    title: 'Tx Id',
    dataIndex: 'tx_id',
    key: 'tx_id',
    align: 'center',
    ellipsis: true,
    render: (text: string) => <Link href={`/tx/${text}`}>{text}</Link>,
  },
  {
    title: 'Time',
    dataIndex: 'time',
    key: 'time',
    align: 'center',
    width: 160,
    render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    title: 'Type(Resource)',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
  },
  {
    title: 'Operation',
    dataIndex: 'method',
    key: 'method',
    align: 'center',
    width: 80,
    render: (text: string) => <span className={`${(text || 'buy').toLocaleLowerCase()}-color`}>{text}</span>,
  },
  {
    title: 'Price(ELF)',
    dataIndex: 'fee',
    key: 'fee',
    align: 'center',
    render: (_, row: any) => {
      let price;
      const { resource, method } = row;
      let { elf, fee } = row;
      elf /= ELF_DECIMAL;
      fee /= ELF_DECIMAL;
      price = ((method === 'Buy' ? elf + fee : elf - fee) / resource).toFixed(ELF_PRECISION);
      price = isNaN(+price) ? '-' : price;
      return price;
    },
  },
  {
    title: 'Amount(Resource)',
    dataIndex: 'resource',
    key: 'number',
    align: 'center',
  },
  {
    title: `Sum(${SYMBOL})`,
    dataIndex: 'elf',
    key: 'elfNumber',
    align: 'center',
    render: (text: string, row: any) => {
      const { method } = row;
      let { elf, fee } = row;
      elf /= ELF_DECIMAL;
      fee /= ELF_DECIMAL;
      const actualNumber = (method === 'Buy' ? elf + fee : elf - fee).toFixed(ELF_PRECISION);
      return actualNumber;
    },
  },
  {
    title: 'Fee(ELF)',
    dataIndex: 'fee',
    key: 'serviceCharge',
    align: 'center',
    render: (text: string, row: any) => {
      let { fee } = row;
      fee /= ELF_DECIMAL;
      return (fee || 0).toFixed(ELF_PRECISION);
    },
  },
  {
    title: 'Tx status',
    dataIndex: 'tx_status',
    key: 'tx_status',
    align: 'center',
  },
];

export {
  PAGE_SIZE,
  RPCSERVER,
  BLOCKS_LIST_COLUMNS,
  ALL_TXS_LIST_COLUMNS,
  ADDRESS_INFO_COLUMN,
  SYMBOL,
  LOWER_SYMBOL,
  CHAIN_ID,
  ELF_DECIMAL,
  TEMP_RESOURCE_DECIMAL,
  ELF_PRECISION,
  GENERAL_PRECISION,
  REAL_TIME_FETCH_INTERVAL,
  RESOURCE_CURRENCY_CHART_FETCH_INTERVAL,
  LONG_NOTIFI_TIME,
};
