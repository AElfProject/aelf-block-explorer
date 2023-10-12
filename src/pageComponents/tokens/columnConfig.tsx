/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:28:28
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { ITableData } from './type';
import Link from 'next/link';
import { Img } from 'react-image';
import { TOEKN_LIST } from '@_utils/imgUtils';
import Image from 'next/image';
import { useState } from 'react';
import ImageWithFallback from '@_components/ImageWithFallback';
import './index.css';
import IconFont from '@_components/IconFont';
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;

export default function getColumns(): ColumnsType<ITableData> {
  return [
    {
      title: '#',
      width: '96px',
      dataIndex: 'rank',
      key: 'rank',
      render: (text) => <span className="block text-xs leading-5">{text}</span>,
    },
    {
      title: 'Token',
      width: '432px',
      dataIndex: 'tokenName',
      key: 'tokenName',
      render: (text, record) => {
        const defaultIcon = <span className="default-icon">{text.slice(0, 1).toUpperCase()}</span>;
        const { logoURI } = TOEKN_LIST.find((ele) => ele.symbol === record.tokenSymbol) || {};
        const logoFragment = logoURI ? (
          // cannot use react-image because it doesn't support ssr
          <ImageWithFallback src={logoURI} fallbackSrc={defaultIcon}></ImageWithFallback>
        ) : (
          defaultIcon
        );
        return (
          <Link href={`/${CHAIN_ID}/token/${text}`} className="token-name">
            <span className="logo-img">{logoFragment}</span>
            <span className="name">{text}</span>(<span className="symbol">{record.tokenSymbol}</span>)
          </Link>
        );
      },
    },
    {
      title: 'Total Supply',
      width: '320px',
      key: 'totalSupply',
      dataIndex: 'totalSupply',
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Circulating Supply',
      key: 'circulatingSupply',
      width: '208px',
      dataIndex: 'circulatingSupply',
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <div className="text-link">
          <IconFont className="mr-1 text-xs" type="Rank" />
          Holders
        </div>
      ),
      key: 'holders',
      width: '208px',
      dataIndex: 'holders',
      render: (text, record) => {
        const holderPercentChange24h = record.holderPercentChange24h.toString();
        return (
          <div className="holder">
            <p>{text}</p>
            <p className={`${holderPercentChange24h.startsWith('-') ? 'text-fall-green' : 'text-rise-red'}`}>
              {record.holderPercentChange24h}
            </p>
          </div>
        );
      },
    },
  ];
}
