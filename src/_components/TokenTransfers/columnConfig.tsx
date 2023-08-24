/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 16:22:36
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import { TokenTransfersItemType } from '@_types/commenDetail';
import { formatDate } from '@_utils/formatter';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Copy from '@_components/Copy';
import Link from 'next/link';
import IconFont from '@_components/IconFont';
import { Tooltip } from 'antd';
import Method from '@_components/Method';
import ContractToken from '@_components/ContractToken';
import { numberFormatter } from '../../_utils/formatter';
import './index.css';
enum Status {
  Success = 'Success',
  fail = 'Fail',
}
export default function getColumns({ timeFormat, columnType, handleTimeChange }): ColumnsType<TokenTransfersItemType> {
  return [
    {
      title: <IconFont className="text-xs" style={{ marginLeft: '6px' }} type="question-circle" />,
      width: 72,
      dataIndex: '',
      key: 'view',
      render: () => (
        <div className="border cursor-pointer bg-white rounded border-color-divider w-6 h-6 flex justify-center items-center focus:bg-color-divider">
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
            <Link className="text-link text-xs block w-[120px] truncate leading-5" href={`tx/${text}`}>
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
          <IconFont className="text-xs" style={{ marginLeft: '4px' }} type="question-circle" />
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
          className="time text-link cursor-pointer font-medium"
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
            <Tooltip title={addressFormat(address)} overlayClassName="table-item-tooltip-white">
              <Link className="text-link" href={`/address/${addressFormat(address)}`}>
                {addressFormat(hiddenAddress(address, 4, 4))}
              </Link>
            </Tooltip>
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
        return <ContractToken address={address} />;
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
            <span className="inline-block leading-5 max-w-[79px] text-base-100 truncate mx-1">{text}</span>
            <span className="flex items-center text-base-200">
              (<span className="inline-block leading-5 max-w-[50px] truncate">ELFELDDDDDDFELF</span>)
            </span>
          </div>
        ) : (
          <div className="item-container flex items-center">
            <div className="nft-img bg-base-200 rounded-lg w-10 h-10 mr-1"></div>
            <div className="info">
              <div className="name max-w-[139px] truncate text-xs leading-5 text-black">
                Unisocks.Fi - Genesis AirGenesis Air
              </div>
              <div className="message leading-[18px] flex items-center">
                <span className="inline-block leading-[18px] font10px truncate max-w-[149.39759px] text-base-200">
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
