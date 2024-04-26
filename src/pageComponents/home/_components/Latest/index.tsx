const clsPrefix = 'home-latest';
import './index.css';

import IconFont from '@_components/IconFont';
import Link from 'next/link';
import { ITransactionItem } from '@pageComponents/home/type';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import clsx from 'clsx';
import EPTooltip from '@_components/EPToolTip';
import { IBlocksResponseItem } from '@_api/type';
import { divDecimals, formatDate } from '@_utils/formatter';
import { useAppSelector } from '@_store';

interface IProps {
  isBlocks: boolean;
  iconType: string;
  data: IBlocksResponseItem[] | ITransactionItem[];
  isMobile: boolean;
}
export default function Latest({ isBlocks, data, iconType, isMobile }: IProps) {
  const { defaultChain } = useAppSelector((state) => state.getChainId);
  const RewrdInfo = (ele) => {
    return (
      <span className="button">
        {ele.reward ? (
          <>
            <span className="reward">{divDecimals(isBlocks ? ele.reward : ele.txnValue)}</span>
            <span>ELF</span>
          </>
        ) : (
          '-'
        )}
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
                      <Link href={`/${defaultChain}/block/${ele.blockHeight}`}>{ele.blockHeight}</Link>
                    ) : (
                      <Link href={`/txn/${ele.transactionHash}`}>{ele.transactionHash}</Link>
                    )}
                  </span>
                  <span className="time">{formatDate(ele.timestamp, 'Age')}</span>
                </div>
              </div>
              <div className="middle">
                {isBlocks ? (
                  <>
                    <span className="producer">
                      Producer
                      <EPTooltip title={ele.producerName} mode="dark" pointAtCenter={false}>
                        <Link href={`${defaultChain}/address/${addressFormat(ele.producerAddress, defaultChain)}`}>
                          {ele.producerName
                            ? ele.producerName
                            : `${addressFormat(hiddenAddress(ele.producerAddress || '', 4, 4), defaultChain)}`}
                        </Link>
                      </EPTooltip>
                    </span>
                    <span className="txns">
                      <Link href={`/${defaultChain}/block/${ele.blockHeight}#txns`}>{ele.transactionCount} txns</Link>
                      <span className="time">in {formatDate(ele.timestamp, 'Age')}</span>
                      {isMobile && RewrdInfo(ele)}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="from">
                      From
                      <EPTooltip title={ele.from} mode="dark" pointAtCenter={false}>
                        <Link href={`${ele.from}`}>{addressFormat(hiddenAddress(ele.from))}</Link>
                      </EPTooltip>
                    </span>
                    <span className="to">
                      To
                      <EPTooltip title={ele.to} mode="dark" pointAtCenter={false}>
                        <Link href={`${ele.to}`}>{addressFormat(hiddenAddress(ele.to))}</Link>
                      </EPTooltip>
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
        <Link href={isBlocks ? `/${defaultChain}/blocks` : `/${defaultChain}/txs`}>
          View All Blocks<IconFont type="right-arrow-2"></IconFont>
        </Link>
      </div>
    </div>
  );
}
