import { Tag } from 'antd';
import moment from 'moment';
import React, { useMemo } from 'react';
import Link from 'next/link';
import IconFont from 'components/IconFont';
import { getFormattedDate } from 'utils/timeUtils';
import CopyButton from 'components/CopyButton/CopyButton';
import addressFormat from 'utils/addressFormat';
import Dividends from 'components/Dividends';

export default function BasicInfo({ basicInfo, bestChainHeight }) {
  const renderObj = useMemo(
    () =>
      basicInfo
        ? {
            'Block Height': (
              <div className="value-height">
                {basicInfo.blockHeight}
                {Number(basicInfo.blockHeight) > bestChainHeight && <Tag className="unconfirmed">Unconfirmed</Tag>}
              </div>
            ),
            Timestamp: (
              <div className="value-timestamp">
                <IconFont type="Time" />
                <span suppressHydrationWarning>
                  {getFormattedDate(basicInfo.timestamp)}({moment(basicInfo.timestamp).format('MMM-DD-YYYY hh:mm:SS A')}
                  )
                </span>
              </div>
            ),
            'Block Hash': basicInfo.blockHash,
            Transactions: `Total ${basicInfo.transactions} transactions`,
            'Chain ID': basicInfo.chainId,
            Miner: (
              <div>
                <Link href={'/address/' + basicInfo.miner}>{addressFormat(basicInfo.miner)}</Link>
                &nbsp;&nbsp;
                <CopyButton value={addressFormat(basicInfo.miner)} />
              </div>
            ),
            Reward: <Dividends dividends={basicInfo.reward ? JSON.parse(basicInfo.reward || '') : {}} />,
            'Previous Block Hash': basicInfo.previousBlockHash,
          }
        : {},
    [basicInfo],
  );

  return (
    <div className={`wrap basic`}>
      {(Object.keys(renderObj) || []).map((key, index) => {
        return (
          <div key={index} className="row">
            <p className="label">{key} : </p>
            <div className="value">{renderObj[key]}</div>
          </div>
        );
      })}
    </div>
  );
}
