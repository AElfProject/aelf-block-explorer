/*
 * @Author: Peterbjx jianxiong.bai@aelf.io
 * @Date: 2023-08-14 18:13:54
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:28:28
 * @Description: columns config
 */
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { formatDate } from '@_utils/formatter';
import Method from '@_components/Method';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Copy from '@_components/Copy';
import ContractToken from '@_components/ContractToken';
import IconFont from '@_components/IconFont';
import EPTooltip from '@_components/EPToolTip';
import { ITransfer } from '@pageComponents/token/type';
enum Status {
  Success = 'Success',
  fail = 'Fail',
}
export default function getColumns({ timeFormat, handleTimeChange }): ColumnsType<ITransfer> {
  return [
    {
      title: <IconFont className="text-xs ml-[6px]" type="question-circle" />,
      width: 24,
      dataIndex: '',
      key: 'view',
      render: () => (
        <div className="flex items-center justify-center w-6 h-6 bg-white border rounded cursor-pointer border-color-divider focus:bg-color-divider">
          <IconFont type="view" />
        </div>
      ),
    },
    {
      dataIndex: 'transactionHash',
      width: 208,
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
        <div className="font-medium cursor-pointer">
          <span>Method</span>
          <IconFont className="ml-1 text-xs" type="question-circle" />
        </div>
      ),
      width: 168,
      dataIndex: 'method',
      key: 'method',
      render: (text) => <Method text={text} tip={text} />,
    },
    {
      title: (
        <div
          className="font-medium cursor-pointer time text-link"
          onClick={handleTimeChange}
          onKeyDown={handleTimeChange}>
          {timeFormat}
        </div>
      ),
      width: 208,
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (text) => {
        return <div className="text-xs leading-5">{formatDate(text, timeFormat)}</div>;
      },
    },
    {
      dataIndex: 'from',
      title: 'From',
      width: 180,
      render: (address) => {
        return (
          <div className="flex items-center address">
            <EPTooltip pointAtCenter={false} title={addressFormat(address)} mode="dark">
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
      width: 40,
      dataIndex: '',
      key: 'from_to',
      render: () => <IconFont className="text-[24px]" type="fromto" />,
    },
    {
      dataIndex: 'to',
      title: 'To',
      width: 180,
      render: (address) => {
        return (
          <div className="flex items-center address">
            <EPTooltip pointAtCenter={false} title={addressFormat(address)} mode="dark">
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
      title: 'Quantity',
      width: 224,
      key: 'quantity',
      dataIndex: 'quantity',
      render: (text) => {
        return <span className="text-base-100">{text}</span>;
      },
    },
  ];
}
