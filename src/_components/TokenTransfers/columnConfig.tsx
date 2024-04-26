/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 16:22:36
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { TokenTransfersItemType } from '@_types/commonDetail';
import { formatDate } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Copy from '@_components/Copy';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import Method from '@_components/Method';
import ContractToken from '@_components/ContractToken';
import { numberFormatter } from '../../_utils/formatter';
import './index.css';
import EPTooltip from '@_components/EPToolTip';
import { AddressType } from '@_types/common';
enum Status {
  Success = 'Success',
  fail = 'Fail',
}
export default function getColumns({ timeFormat, columnType, handleTimeChange }): ColumnsType<TokenTransfersItemType> {
  return [
    {
      title: <IconFont className="ml-[6px] text-xs" type="question-circle" />,
      width: 72,
      dataIndex: '',
      key: 'view',
      render: () => (
        <div className="flex size-6 cursor-pointer items-center justify-center rounded border border-color-divider bg-white focus:bg-color-divider">
          <IconFont type="view" />
        </div>
      ),
    },
    {
      dataIndex: 'transactionHash',
      width: 168,
      key: 'transactionHash',
      title: 'Txn Hash',
      render: (text, records) => {
        return (
          <div className="flex items-center">
            {records.status === Status.fail && <IconFont className="mr-1" type="question-circle-error" />}
            <Link className="block w-[120px] truncate text-xs leading-5 text-link" href={`tx/${text}`}>
              {text}
            </Link>
          </div>
        );
      },
    },
    {
      title: (
        <div className="cursor-pointer font-medium">
          <span>Method</span>
          <IconFont className="ml-1 text-xs" type="question-circle" />
        </div>
      ),
      width: 128,
      dataIndex: 'method',
      key: 'method',
      render: (text) => <Method text={text} tip={text} />,
    },
    {
      title: (
        <div
          className="time cursor-pointer font-medium text-link"
          onClick={handleTimeChange}
          onKeyDown={handleTimeChange}>
          {timeFormat}
        </div>
      ),
      width: 144,
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => {
        return <div className="text-xs leading-5">{formatDate(text, timeFormat)}</div>;
      },
    },
    {
      dataIndex: 'from',
      title: 'From',
      width: 196,
      render: (text) => {
        const { address } = JSON.parse(text);
        return (
          <div className="address flex items-center">
            <EPTooltip title={addressFormat(address)} mode="dark" pointAtCenter={false}>
              <Link className="text-link" href={`/address/${addressFormat(address)}`}>
                {addressFormat(hiddenAddress(address, 4, 4))}
              </Link>
            </EPTooltip>
            <Copy value={addressFormat(address)} />
            <div className="flex items-center"></div>
          </div>
        );
      },
    },
    {
      title: '',
      width: 52,
      dataIndex: 'transferStatus',
      key: 'transferStatus',
      render: (text) => {
        return (
          <div className="in-out-container">
            {text === 'in' ? <div className="in-container">In</div> : <div className="out-container">Out</div>}
          </div>
        );
      },
    },
    {
      dataIndex: 'to',
      title: 'To',
      width: 196,
      render: (text) => {
        const { address } = JSON.parse(text);
        return <ContractToken address={address} type={AddressType.address} chainId="AELF" />;
      },
    },
    {
      title: 'Amount',
      width: 192,
      key: 'amount',
      dataIndex: 'amount',
      render: (text) => {
        return <span className="text-base-100">{numberFormatter(text, '')}</span>;
      },
    },
    {
      title: columnType === 'Token' ? 'Token' : 'Item',
      width: 224,
      key: columnType === 'Token' ? 'token' : 'item',
      dataIndex: columnType === 'Token' ? 'token' : 'item',
      render: (text) => {
        return columnType === 'Token' ? (
          <div className="flex items-center">
            <IconFont type="Aelf-transfer" />
            <span className="mx-1 inline-block max-w-[79px] truncate leading-5 text-base-100">{text}</span>
            <span className="flex items-center text-base-200">
              (<span className="inline-block max-w-[50px] truncate leading-5">ELFELDDDDDDFELF</span>)
            </span>
          </div>
        ) : (
          <div className="item-container flex items-center">
            <div className="nft-img mr-1 size-10 rounded-lg bg-base-200"></div>
            <div className="info">
              <div className="name max-w-[139px] truncate text-xs leading-5 text-black">
                Unisocks.Fi - Genesis AirGenesis Air
              </div>
              <div className="message flex items-center leading-[18px]">
                <span className="font10px inline-block max-w-[149.39759px] truncate leading-[18px] text-base-200">
                  NFT: Unisocks Genesis AiAiAi
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
  ];
}
