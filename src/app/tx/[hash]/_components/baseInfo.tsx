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
        value: (
          <div>
            <ContractToken address="AELF.Contract.Token" />
            <div className="flex items-center mt-2 leading-[18px]">
              <IconFont className="text-xs" type="Tab" />
              <span className="mx-1 text-[10px] text-base-200">Transferred</span>
              <span className="text-[10px]">{numberFormatter('2113.0231222')}</span>
              <span className="mx-1 text-[10px] text-base-200">From</span>
              <span className="text-link text-[10px]">{addressFormat(hiddenAddress(data.transactionHash))}</span>
              <Copy value={addressFormat(data.transactionHash)} />
              <span className="mx-1 text-base-200 text-[10px]">To</span>
              <span className="text-link text-[10px]">OKEX3</span>
              <Copy value="OKEX3" />
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
            <div className=" flex items-center token-transferred">
              <IconFont type="arrow" />
              <span className="mx-1 text-base-200">From</span>
              <span className="text-link">{addressFormat(hiddenAddress(data.transactionHash))}</span>
              <Copy value={addressFormat(data.transactionHash)} />
              <span className="mx-1 text-base-200">To</span>
              <span className="text-link">OKEX3</span>
              <Copy value="OKEX3" />
              <span className="mx-1 text-base-200">For</span>
              <span>{numberFormatter('2113.0231222', '')}</span>
              <DollarCurrencyRate />
              <IconFont className="text-base mx-1" type="Aelf-transfer" />
              <span className="text-link">ELF</span>
              <span>(ELF)</span>
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
            <div className="nft-transferred flex items-center">
              <div className="nft-img w-10 h-10 rounded-lg bg-slate-200"></div>
              <div className="nft-info ml-1">
                <div className="text-xs leading-5">
                  <span className="inline-block text-base-200">For</span>
                  <span className="mx-1 inline-block">1 Of NFT</span>
                  <span className="text-link inline-block">wordwar2 series(CARD-001)</span>
                </div>
                <div>
                  <span className="inline-block">From</span>
                  <span className="inline-block text-link ml-1">OKEX3</span>
                  <Copy value="OKEX3" />
                  <span className="inline-block mx-1 text-base-200">To</span>
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
  }, [data]);
  return <DetailContainer infoList={renderInfo} />;
}
