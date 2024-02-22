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
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import { useMobileContext } from '@app/pageProvider';
import clsx from 'clsx';
import useResponsive from '@_hooks/useResponsive';
export default function BaseInfo({ data }: { data: TxnSData }) {
  const { isMobile } = useResponsive();
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
        value: (
          <div>
            <ContractToken address="AELF.Contract.Token" />
            <div className={clsx('mt-2 flex items-center leading-[18px]', isMobile && 'flex-col !items-start')}>
              <div>
                <IconFont className="text-xs" type="Tab" />
                <span className="font10px mx-1 inline-block leading-[18px] text-base-200">Transferred</span>
                <span className="font10px inline-block leading-[18px]">{numberFormatter('2113.0231222')}</span>
              </div>
              <div>
                <span className="font10px mx-1 inline-block leading-[18px] text-base-200">From</span>
                <span className="font10px inline-block leading-[18px] text-link">
                  {addressFormat(hiddenAddress(data.transactionHash))}
                </span>
                <Copy value={addressFormat(data.transactionHash)} />
                <span className="font10px mx-1 inline-block leading-[18px] text-base-200">To</span>
                <span className="font10px inline-block leading-[18px] text-link">OKEX3</span>
                <Copy value="OKEX3" />
              </div>
            </div>
          </div>
        ),
      },
      {
        label: 'divider2',
        value: 'divider',
      },
      {
        label: 'Tokens Transferred ',
        tip: 'Tokens Transferred ',
        value: (
          <div>
            <div className={clsx(isMobile && 'flex-col !items-start', 'token-transferred flex items-center')}>
              <div>
                <IconFont type="arrow" />
                <span className="mx-1 text-base-200">From</span>
                <span className="text-link">{addressFormat(hiddenAddress(data.transactionHash))}</span>
                <Copy value={addressFormat(data.transactionHash)} />
              </div>
              <div>
                <span className="mx-1 text-base-200">To</span>
                <span className="text-link">OKEX3</span>
                <Copy value="OKEX3" />
              </div>
              <div className="flex items-center">
                <span className="mx-1 text-base-200">For</span>
                <span>{numberFormatter('2113.0231222', '')}</span>
                <DollarCurrencyRate />
              </div>
              <div>
                <IconFont className="mx-1 text-base" type="Aelf-transfer" />
                <span className="text-link">ELF</span>
                <span>(ELF)</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        label: 'divider3',
        value: 'divider',
      },
      {
        label: 'NFTs Transferred ',
        tip: 'NFTs Transferred ',
        value: (
          <div>
            <div className={clsx(isMobile && 'flex-col !items-start', 'nft-transferred flex items-center')}>
              <div className={clsx(isMobile && 'mb-2', 'nft-img size-10 rounded-lg bg-slate-200')}></div>
              <div className="nft-info ml-1">
                <div className="text-xs leading-5">
                  <span className="inline-block text-base-200">For</span>
                  <span className="mx-1 inline-block">1 Of NFT</span>
                  <span className="inline-block text-link">wordwar2 series(CARD-001)</span>
                </div>
                <div>
                  <span className="inline-block">From</span>
                  <span className="ml-1 inline-block text-link">OKEX3</span>
                  <Copy value="OKEX3" />
                  <span className="mx-1 inline-block text-base-200">To</span>
                  <span className="inline-block text-link">{addressFormat(hiddenAddress(data.transactionHash))}</span>
                  <Copy value={addressFormat(data.transactionHash)} />
                </div>
              </div>
            </div>
          </div>
        ),
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
  }, [data, isMobile]);
  return <DetailContainer infoList={renderInfo} />;
}
