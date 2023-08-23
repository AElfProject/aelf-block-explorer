/*
 * @author: Peterbjx
 * @Date: 2023-08-17 11:05:56
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 14:42:02
 * @Description: baseinfo
 */

import DetailContainer from '@_components/DetailContainer';
import { useMemo } from 'react';
import ConfirmStatus from '@_components/ConfirmedStatus';
import IconFont from '@_components/IconFont';
import { formatDate } from '@_utils/formatter';
import dayjs from 'dayjs';
import Copy from '@_components/Copy';
import { useRouter } from 'next/navigation';
import JumpButton, { JumpTypes } from '@_components/JumpButton';
import SizeBytes from '@_components/SizeBytes';
import DollarCurrencyRate from '@_components/DollarCurrencyRate';
export default function BaseInfo({ data }) {
  const router = useRouter();
  const disabled = data.blockHeight === 1;
  const jump = (type: JumpTypes) => {
    switch (type) {
      case JumpTypes.Prev:
        router.push(`/block/${data.blockHeight - 1}`);
        break;
      case JumpTypes.Next:
        router.push(`/block/${data.blockHeight + 1}`);
    }
  };
  const renderInfo = useMemo(() => {
    return [
      {
        label: 'Blocks Height',
        tip: 'Blocks Height',
        value: (
          <div className="flex items-center">
            <span className="mr-2">{data.blockHeight}</span>
            <JumpButton isFirst={disabled} jump={jump} />
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
        label: 'Transactions ',
        tip: 'Transactions ',
        value: (
          <div className="text-xs leading-5">
            <span className=" text-link cursor-pointer">{data.total} transactions</span>
            <span className="ml-1">in this block</span>
          </div>
        ),
      },
      {
        label: 'Chain ID ',
        tip: 'Chain ID ',
        value: <div className="text-xs leading-5">{data.chainId}</div>,
      },
      {
        label: 'divider1',
        value: 'divider',
      },
      {
        label: 'Producer ',
        tip: 'Producer ',
        value: (
          <div className="text-xs leading-5">
            <span className="text-link">{data.producer.chainId}</span>
            <Copy value={data.producer.name} />
            <span className="ml-1">in 0.5 secs</span>
          </div>
        ),
      },
      {
        label: 'Block Reward ',
        tip: 'Block Reward ',
        value: (
          <div className="flex items-center text-xs leading-5">
            <span className="mr-1">{data.reward}</span>
            <DollarCurrencyRate />
          </div>
        ),
      },
      {
        label: 'Size ',
        tip: 'Size ',
        value: <SizeBytes size={data.blockSize} />,
      },
      {
        label: 'divider2',
        value: 'divider',
      },
      {
        label: 'Burnt Fees ',
        tip: 'Burnt Fees ',
        value: (
          <div className="flex items-center text-xs leading-5">
            <span className="mr-1">{data.burntFee}</span>
            <div className="flex items-center ml-1 h-6 px-4 rounded bg-ECEEF2">
              <span className="mr-1">$</span>21.13
            </div>
          </div>
        ),
      },
      {
        label: 'divider3',
        value: 'divider',
      },
    ];
  }, [data]);
  return <DetailContainer infoList={renderInfo} />;
}
