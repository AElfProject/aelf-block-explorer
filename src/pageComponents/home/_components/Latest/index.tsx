const clsPrefix = 'home-latest';
import './index.css';

import IconFont from '@_components/IconFont';
import Link from 'next/link';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import clsx from 'clsx';
import EPTooltip from '@_components/EPToolTip';
import { IBlocksResponseItem, ITransactionsResponseItem } from '@_api/type';
import { divDecimals, formatDate } from '@_utils/formatter';
import { useAppSelector } from '@_store';
import ContractToken from '@_components/ContractToken';
import { AddressType } from '@_types/common';

interface IProps {
  isBlocks: boolean;
  iconType: string;
  data: IBlocksResponseItem[] | ITransactionsResponseItem[];
  isMobile: boolean;
}
export default function Latest({ isBlocks, data, iconType, isMobile }: IProps) {
  const { defaultChain } = useAppSelector((state) => state.getChainId);
  const RewrdInfo = (ele) => {
    return (
      <span className="button">
        {ele.reward || ele.transactionFee ? (
          <>
            <span className="reward">{divDecimals(isBlocks ? ele.reward : ele.transactionFee)}</span>
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
            <div className="item" key={ele.transactionId || ele.blockHeight}>
              <div className="left">
                <IconFont type={iconType}></IconFont>
                <div className="text">
                  <span className="height">
                    {isBlocks ? (
                      <Link href={`/${defaultChain}/block/${ele.blockHeight}`}>{ele.blockHeight}</Link>
                    ) : (
                      <EPTooltip title={ele.transactionId} mode="dark" pointAtCenter={false}>
                        <Link href={`/${defaultChain}/tx/${ele.transactionId}?blockHeight=${ele.blockHeight}`}>
                          {ele.transactionId}
                        </Link>
                      </EPTooltip>
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
                      <ContractToken
                        address={ele?.from?.address}
                        showCopy={false}
                        type={ele.from.addressType}
                        chainId={defaultChain as string}
                      />
                    </span>
                    <span className="to">
                      To
                      <ContractToken
                        address={ele.to?.address}
                        type={AddressType.address}
                        showCopy={false}
                        chainId={defaultChain as string}
                      />
                      {/* <EPTooltip title={ele.to} mode="dark" pointAtCenter={false}>
                        <Link href={`${ele.to}`}>{addressFormat(hiddenAddress(ele.to))}</Link>
                      </EPTooltip> */}
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
        <Link href={isBlocks ? `/${defaultChain}/blocks` : `/${defaultChain}/transactions`}>
          View All {isBlocks ? 'Blocks' : 'Transactions'}
          <IconFont type="right-arrow-2"></IconFont>
        </Link>
      </div>
    </div>
  );
}
