/*
 * @author: Peterbjx
 * @Date: 2023-08-17 11:05:56
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-18 14:42:02
 * @Description: baseinfo
 */

import DetailContainer from '@_components/DetailContainer';
import { useCallback, useMemo } from 'react';
import ConfirmStatus from '@_components/ConfirmedStatus';
import IconFont from '@_components/IconFont';
import { addSymbol, divDecimals, formatDate } from '@_utils/formatter';
import dayjs from 'dayjs';
import Copy from '@_components/Copy';
import { useRouter } from 'next/navigation';
import JumpButton, { JumpTypes } from '@_components/JumpButton';
import SizeBytes from '@_components/SizeBytes';
import DollarCurrencyRate from '@_components/DollarCurrencyRate';
import addressFormat from '@_utils/urlUtils';
import { StatusEnum } from '@_types/status';
export default function BaseInfo({ data }) {
  const router = useRouter();
  const isFirst = data.preBlockHeight === 0;
  const isLast = data.nextBlockHeight === 0;
  const jump = useCallback(
    (type: JumpTypes) => {
      switch (type) {
        case JumpTypes.Prev:
          router.push(`/block/${data.preBlockHeight}`);
          break;
        case JumpTypes.Next:
          router.push(`/block/${data.nextBlockHeight}`);
      }
    },
    [data, router],
  );
  const renderInfo = useMemo(() => {
    return [
      {
        label: 'Blocks Height',
        tip: 'The number of blocks from the genesis block to the current one.',
        value: (
          <div className="flex items-center">
            <span className="mr-2">{data.blockHeight}</span>
            <JumpButton isFirst={isFirst} isLast={isLast} jump={jump} />
          </div>
        ),
      },
      {
        label: 'Status ',
        tip: 'The status of the block.',
        value: (
          <div className="flex">
            <ConfirmStatus status={data.confirmed ? StatusEnum.Confirmed : StatusEnum.Unconfrimed} />
          </div>
        ),
      },
      {
        label: 'Timestamp ',
        tip: 'The date and time at which the block is produced.',
        value: (
          <div className="value-timestamp">
            <IconFont className="mr-1 !text-xs !leading-5" type="Time" />
            <span>
              {formatDate(data.timestamp, 'age')}({dayjs.unix(data.timestamp).format('MMM-DD-YYYY hh:mm:ss Z')})
            </span>
          </div>
        ),
      },
      {
        label: 'Transactions ',
        tip: 'The number of transactions in the block.',
        value: (
          <div className="text-xs leading-5">
            <span className=" cursor-pointer text-link">{data.total} transactions</span>
            <span className="ml-1">in this block</span>
          </div>
        ),
      },
      {
        label: 'Chain ID ',
        tip: 'The chain on which the block is produced.',
        value: <div className="text-xs leading-5">{data.chainId}</div>,
      },
      {
        label: 'divider1',
        value: 'divider',
      },
      {
        label: 'Producer ',
        tip: 'The producer of the block.',
        value: (
          <div className="text-xs leading-5">
            <span className="text-link">
              {data.producer.name ? data.producer.name : addressFormat(data.producer.address)}
            </span>
            <Copy value={data.producer.address} />
            <span className="ml-1">in 0.5 secs</span>
          </div>
        ),
      },
      {
        label: 'Block Reward ',
        tip: 'The block reward given by aelf network, unaffected by the specific transaction.',
        value: (
          <div className="flex items-center text-xs leading-5">
            <span className="mr-1">{addSymbol(divDecimals(data.reward.elfReward))}</span>
            {data.reward.usdReward && <DollarCurrencyRate price={data.reward.usdReward} />}
          </div>
        ),
      },
      {
        label: 'Size ',
        tip: 'The size of the block.',
        value: <SizeBytes size={data.blockSize} />,
      },
      {
        label: 'divider2',
        value: 'divider',
      },
      {
        label: 'Burnt Fees ',
        tip: 'Each transaction will burn 10% of its Size Fee.',
        value: (
          <div className="flex items-center text-xs leading-5">
            <span className="mr-1">{addSymbol(divDecimals(data.burntFee.elfFee))}</span>
            {data.burntFee.usdFee && <DollarCurrencyRate price={data.burntFee.usdFee} />}
          </div>
        ),
      },
      {
        label: 'divider3',
        value: 'divider',
      },
    ];
  }, [data, isFirst, isLast, jump]);
  return <DetailContainer infoList={renderInfo} />;
}
