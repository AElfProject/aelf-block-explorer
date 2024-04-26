import DetailContainer from '@_components/DetailContainer';
import { useMemo } from 'react';
import ConfirmStatus from '@_components/TransactionsStatus';
import IconFont from '@_components/IconFont';
import { formatDate, numberFormatter } from '@_utils/formatter';
import dayjs from 'dayjs';
import Copy from '@_components/Copy';
import DollarCurrencyRate from '@_components/DollarCurrencyRate';
import Link from 'next/link';
import Method from '@_components/Method';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import clsx from 'clsx';
import { useMobileAll } from '@_hooks/useResponsive';
import { ITransactionDetailData } from '@_api/type';
import { AddressType } from '@_types/common';
import { HashAddress, Tag } from 'aelf-design';
import Image from 'next/image';

export default function BaseInfo({ data }: { data: ITransactionDetailData }) {
  const { isMobile } = useMobileAll();
  const renderInfo = useMemo(() => {
    return [
      {
        label: 'Transactions Hash',
        tip: 'A TxHash or transaction hash is a unique 64 character identifier that is generated whenever a transaction is executed.',
        value: (
          <div>
            {data.transactionId}
            <Copy value={data.transactionId} />
          </div>
        ),
      },
      {
        label: 'Status',
        tip: 'The status of the transaction.',
        value: (
          <div className="flex">
            <ConfirmStatus status={data.status} />
          </div>
        ),
      },
      {
        label: 'Block',
        tip: 'Number of the block in which the transaction is recorded.',
        value: (
          <div className="flex items-center">
            <IconFont className="mr-1" type="correct" />
            <Link href={`block/${data.blockHeight}`}>{data.blockHeight}</Link>
          </div>
        ),
      },
      {
        label: 'Timestamp ',
        tip: 'The date and time at which the transaction is produced.',
        value: (
          <div>
            <IconFont className="mr-1" type="Time" />
            <span>
              {formatDate(data.timestamp, 'age')}({dayjs(data.timestamp).format('MMM-DD-YYYY hh:mm:ss A [+UTC]')})
            </span>
          </div>
        ),
      },
      {
        label: 'Method ',
        tip: 'Function executed based on input data.',
        value: <Method text={data.method} tip={data.method} truncate={false} />,
      },
      {
        label: 'divider1',
        value: 'divider',
      },
      {
        label: 'From ',
        tip: 'The sending party of the transaction.',
        value: (
          <div className="flex flex-row items-center gap-1">
            <HashAddress size="small" address={data.from.address} />
            {data.from.isManager && <Tag color="processing">Manager</Tag>}
          </div>
        ),
      },
      {
        label: 'Interacted With(To) ',
        tip: 'The receiving party of the transaction (could be a contract address).',
        value: (
          <div>
            {/* <ContractToken address="AELF.Contract.Token" /> */}
            {data.to.address ? <HashAddress size="small" address={data.to.address} /> : '-'}

            {/* <div className={clsx('mt-2 flex items-center leading-[18px]', isMobile && 'flex-col !items-start')}>
              <div>
                <IconFont className="text-xs" type="Tab" />
                <span className="font10px mx-1 inline-block leading-[18px] text-base-200">Transferred</span>
                <span className="font10px inline-block leading-[18px]">{numberFormatter('2113.0231222')}</span>
              </div>
              <div>
                <span className="font10px mx-1 inline-block leading-[18px] text-base-200">From</span>
                <span className="font10px inline-block leading-[18px] text-link">
                  {addressFormat(hiddenAddress(data.transactionId))}
                </span>
                <Copy value={addressFormat(data.transactionId)} />
                <span className="font10px mx-1 inline-block leading-[18px] text-base-200">To</span>
                <span className="font10px inline-block leading-[18px] text-link">OKEX3</span>
                <Copy value="OKEX3" />
              </div>
            </div> */}
          </div>
        ),
      },
      {
        label: 'divider2',
        value: 'divider',
      },
      {
        label: 'Tokens Transferred ',
        tip: 'List of tokens transferred in the transaction.',
        value: (
          <div>
            {data.tokenTransferreds.length > 0
              ? data.tokenTransferreds.map((tokenTransfer, idx) => {
                  return (
                    <div key={idx} className={clsx(isMobile && 'flex-col !items-start', 'flex items-center')}>
                      <div>
                        <IconFont type="arrow" />
                        <span className="mx-1 text-base-200">From</span>
                        <HashAddress size="small" address={tokenTransfer.from.address} />
                      </div>
                      <div>
                        <span className="mx-1 text-base-200">To</span>
                        <HashAddress size="small" address={tokenTransfer.to.address} />
                      </div>
                      <div className="flex items-center">
                        <span className="mx-1 text-base-200">For</span>
                        <span>{numberFormatter(tokenTransfer.amount + '', '')}</span>
                        <DollarCurrencyRate nowPrice={tokenTransfer.nowPrice} tradePrice={tokenTransfer.tradePrice} />
                      </div>
                      <div>
                        {/* <Image src={tokenTransfer.imageUrl} alt="" width={16} height={16} /> */}
                        <span className="text-link">{tokenTransfer.name}</span>
                        <span>{`(${tokenTransfer.symbol})`}</span>
                      </div>
                    </div>
                  );
                })
              : '-'}
          </div>
        ),
      },
      {
        label: 'divider3',
        value: 'divider',
      },
      {
        label: 'NFTs Transferred ',
        tip: 'The amount of txn fee token transacted.',
        value: (
          <div>
            {data.nftsTransferreds.length > 0
              ? data.nftsTransferreds.map((nftsTransfer, idx) => {
                  return (
                    <div
                      key={idx}
                      className={clsx(isMobile && 'flex-col !items-start', 'nft-transferred flex items-center')}>
                      {/* <Image
                    className={clsx(isMobile && 'mb-2', 'rounded-lg bg-slate-200')}
                    src={nftsTransfer.imageUrl}
                    alt=""
                    width={40}
                    height={40}
                  /> */}

                      <div className="nft-info ml-1">
                        <div className="text-xs leading-5">
                          <span className="inline-block text-base-200">For</span>
                          <span className="mx-1 inline-block">{idx + 1} Of NFT</span>
                          <span className="inline-block text-link">{`${nftsTransfer.name}(${nftsTransfer.symbol})`}</span>
                        </div>
                        <div className="flex">
                          <span className="mr-1 inline-block">From</span>
                          <HashAddress size="small" address={nftsTransfer.from.address} preLen={8} endLen={8} />
                          <span className="mx-1 inline-block text-base-200">To</span>
                          <HashAddress size="small" address={nftsTransfer.to.address} preLen={8} endLen={8} />
                        </div>
                      </div>
                    </div>
                  );
                })
              : '-'}
          </div>
        ),
      },
      {
        label: 'divider4',
        value: 'divider',
      },
      {
        label: 'Value ',
        tip: 'The amount of txn fee token transacted.',
        value: (
          <div className={clsx('flex', isMobile ? 'flex-col items-start' : 'items-center')}>
            {data.transactionValues.map((transactionValue, idx) => {
              return (
                <div
                  key={idx}
                  className={clsx('flex items-center', idx !== 0 && !isMobile && 'border-0 border-l bg-color-divider')}>
                  <span>{numberFormatter(transactionValue.amount + '')}</span>
                  <span>{transactionValue.symbol}</span>
                  <DollarCurrencyRate nowPrice={transactionValue.nowPrice} tradePrice={transactionValue.tradePrice} />
                </div>
              );
            })}
          </div>
        ),
      },
    ];
  }, [data, isMobile]);
  return <DetailContainer infoList={renderInfo} />;
}
