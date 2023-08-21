const clsPrefix = 'home-latest';
import './index.css';

import IconFont from '@_components/IconFont';
import { getFormattedDate } from '@_utils/timeUtils';
import Link from 'next/link';
import { Tooltip } from 'antd';
import { IBlockItem, ITransactionItem } from '@pageComponents/home/type';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import clsx from 'clsx';

interface IProps {
  isBlocks: boolean;
  iconType: string;
  data: IBlockItem[] | ITransactionItem[];
  isMobile: boolean;
}
export default function Latest({ isBlocks, data, iconType, isMobile }: IProps) {
  const RewrdInfo = (ele) => {
    return (
      <span className="button">
        <span className="reward">{isBlocks ? ele.reward : ele.txnValue}</span>
        <span>ELF</span>
      </span>
    );
  };
  return (
    <div className={clsx(clsPrefix, isMobile && `${clsPrefix}-mobile`)}>
      <div className="title">{`Latest ${isBlocks ? 'Blocks' : 'Transactions'}`}</div>
      <div className="content">
        {data.map((ele) => {
          return (
            <div className="item" key={ele.blockHeight || ele.id}>
              <div className="left">
                <IconFont type={iconType}></IconFont>
                <div className="text">
                  <span className="height">
                    {isBlocks ? (
                      <Link href={`/block/${ele.blockHeight}`}>{ele.blockHeight}</Link>
                    ) : (
                      <Link href={`/txn/${ele.transactionHash}`}>{ele.transactionHash}</Link>
                    )}
                  </span>
                  <span className="time">{getFormattedDate(ele.timestamp)}</span>
                </div>
              </div>
              <div className="middle">
                {isBlocks ? (
                  <>
                    <span className="producer">
                      Producer
                      <Tooltip title={ele.producer?.name}>
                        <Link href={`${ele.producer?.address}`}>{ele.producer?.name}</Link>
                      </Tooltip>
                    </span>
                    <span className="txns">
                      <Link href={`/block/${ele.blockHeight}#txns`}>{ele.txns} txns</Link>
                      <span className="time">in {getFormattedDate(ele.timestamp)}</span>
                      {isMobile && RewrdInfo(ele)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="from">
                      From
                      <Tooltip title={ele.from}>
                        <Link href={`${ele.from}`}>{addressFormat(hiddenAddress(ele.from))}</Link>
                      </Tooltip>
                    </span>
                    <span className="to">
                      To
                      <Tooltip title={ele.to}>
                        <Link href={`${ele.to}`}>{addressFormat(hiddenAddress(ele.to))}</Link>
                      </Tooltip>
                      {isMobile && RewrdInfo(ele)}
                    </span>
                  </>
                )}
              </div>
              {!isMobile && <div className="right">{RewrdInfo(ele)}</div>}
            </div>
          );
        })}
      </div>
      <div className="link">
        <Link href={isBlocks ? '/blocks' : '/txs'}>
          View All Blocks<IconFont type="right-arrow-2"></IconFont>
        </Link>
      </div>
    </div>
  );
}
