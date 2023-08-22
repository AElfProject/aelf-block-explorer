import DetailContainer from '@_components/DetailContainer';
import { useMemo } from 'react';
import ConfirmStatus from '@_components/ConfirmedStatus';
import IconFont from '@_components/IconFont';
import { formatDate, numberFormatter } from '@_utils/formatter';
import dayjs from 'dayjs';
import Copy from '@_components/Copy';
import DollarCurrencyRate from '@_components/DollarCurrencyRate';
import { TxnSData } from '../type';
import Link from 'next/link';
import Method from '@_components/Method';
import ContractToken from '@_components/ContractToken';
export default function BaseInfo({ data }: { data: TxnSData }) {
  const renderInfo = useMemo(() => {
    return [
      {
        label: 'Transactions Hash ',
        tip: 'Transactions Hash ',
        value: (
          <div>
            {data.transactionHash}
            <Copy value={data.transactionHash} />
          </div>
        ),
      },
      {
        label: 'Status ',
        tip: 'Status ',
        value: (
          <div className="flex">
            <ConfirmStatus status={data.status} />
          </div>
        ),
      },
      {
        label: 'Block  ',
        tip: 'Block  ',
        value: (
          <div className="flex items-center">
            <IconFont className="mr-1" type="correct" />
            <Link href={`block/${data.block}`}>{data.block}</Link>
          </div>
        ),
      },
      {
        label: 'Timestamp ',
        tip: 'Timestamp ',
        value: (
          <div className="value-timestamp">
            <IconFont className="mr-1" type="Time" />
            <span>
              {formatDate(data.timestamp, 'age')}({dayjs(data.timestamp).format('MMM-DD-YYYY hh:mm:ss A [+UTC]')})
            </span>
          </div>
        ),
      },
      {
        label: 'Method ',
        tip: 'Method ',
        value: <Method text={data.method} tip={data.method} truncate={false} />,
      },
      {
        label: 'divider1',
        value: 'divider',
      },
      {
        label: 'From ',
        tip: 'From ',
        value: (
          <div className="text-link">
            {JSON.parse(data.from).address} <Copy value={JSON.parse(data.from).address} />
          </div>
        ),
      },
      {
        label: 'Interacted With(To) ',
        tip: 'Interacted With(To) ',
        value: <ContractToken address="AELF.Contract.Token" />,
      },
      {
        label: 'divider2',
        value: 'divider',
      },
      {
        label: 'Tokens Transferred ',
        tip: 'Tokens Transferred ',
        value: <span>todo</span>,
      },
      {
        label: 'divider3',
        value: 'divider',
      },
      {
        label: 'NFTs Transferred ',
        tip: 'NFTs Transferred ',
        value: <span>todo</span>,
      },
      {
        label: 'divider4',
        value: 'divider',
      },
      {
        label: 'Value ',
        tip: 'Value ',
        value: (
          <div className="flex items-center">
            <span>{numberFormatter(data.value)}</span>
            <DollarCurrencyRate />
          </div>
        ),
      },
    ];
  }, [data]);
  return <DetailContainer infoList={renderInfo} />;
}
