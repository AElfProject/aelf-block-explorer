import DetailContainer from '@_components/DetailContainer';
import { TxnSData } from '../type';
import { useMemo } from 'react';
import { numberFormatter } from '@_utils/formatter';
import DollarCurrencyRate from '@_components/DollarCurrencyRate';
import Link from 'next/link';
import CodeBlock from '@_components/CodeBlock';
import SizeBytes from '@_components/SizeBytes';
import { useMobileContext } from '@app/pageProvider';
import clsx from 'clsx';

export default function ExtensionInfo({ data }: { data: TxnSData }) {
  const { isMobileSSR: isMobile } = useMobileContext();
  const renderInfo = useMemo(() => {
    return [
      {
        label: 'Transaction Fee ',
        tip: 'Transaction Fee ',
        value: (
          <div className="flex items-center">
            <span>{numberFormatter(data.transactionFee)}</span>
            <DollarCurrencyRate />
          </div>
        ),
      },
      {
        label: 'Resources Fee ',
        tip: 'Resources Fee ',
        value: numberFormatter(data.resourcesFee),
      },
      {
        label: 'divider1',
        value: 'divider',
      },
      {
        label: 'Burnt Fee ',
        tip: 'Burnt Fee ',
        value: (
          <div className={clsx(isMobile && 'flex-col !items-start', 'flex items-center')}>
            <div className={clsx(isMobile && 'mb-2', 'flex items-center')}>
              {numberFormatter(data.burntFee)}
              <DollarCurrencyRate />
            </div>
            {!isMobile && <div className="h-6 w-[1px] mx-2 bg-color-divider"></div>}
            <div className="flex items-center">
              {numberFormatter(data.burntFee, 'USDT')} <DollarCurrencyRate />
            </div>
          </div>
        ),
      },
      {
        label: 'divider2',
        value: 'divider',
      },
      {
        label: 'Transaction Ref Block Number ',
        tip: 'Transaction Ref Block Number ',
        value: <Link href={`/block/${data.TransactionRefBlockNumber}`}>{data.TransactionRefBlockNumber}</Link>,
      },
      {
        label: 'Transaction Ref Block Prefix ',
        tip: 'Transaction Ref Block Prefix ',
        value: data.transactionRefBlockPrefix,
      },
      {
        label: 'Transaction Parameters ',
        tip: 'Transaction Parameters ',
        value: <CodeBlock value={data.transactionParams} />,
      },
      {
        label: 'divider3',
        value: 'divider',
      },
      {
        label: 'Return Value ',
        tip: 'Return Value ',
        value: <span>{data.returnValue || '-'}</span>,
      },
      {
        label: 'Transaction Signature ',
        tip: 'Transaction Signature ',
        value: data.transactionSignature,
      },
      {
        label: 'Transaction Size ',
        tip: 'Transaction Size ',
        value: <SizeBytes size={Number(data.transactionSize)} />,
      },
    ];
  }, [data, isMobile]);
  return <DetailContainer infoList={renderInfo} />;
}
