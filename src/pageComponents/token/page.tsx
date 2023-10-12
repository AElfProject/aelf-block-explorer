'use client';
import { useMobileContext } from '@app/pageProvider';
import Copy from '@_components/Copy';
import HeadTitle from '@_components/HeaderTitle';
import IconFont from '@_components/IconFont';
import { numberFormatter } from '@_utils/formatter';
import Link from 'next/link';
import { ITokenData } from './type';
import Overview from './_components/overview';
import clsx from 'clsx';
import ImageWithFallback from '@_components/ImageWithFallback';
import './index.css';
import EPTabs from '@_components/EPTabs';
import Transfers from './_components/Transfers';
import Holders from './_components/Holders';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
export default function TokenItem({ SSRData }: { SSRData: ITokenData }) {
  const {
    tokenLogo,
    tokenName,
    tokenSymbol,
    totalSupply,
    holderPercentChange24h,
    totalTransfers,
    priceInUsd,
    pricePercentChange24h,
    contractAddress,
    decimals,
    transfers,
    holders,
  } = SSRData;
  const { isMobileSSR: isMobile } = useMobileContext();
  const overviewInfoLeft = [
    {
      key: 'TOTAL SUPPLY',
      label: (
        <div>
          <IconFont className="mr-1" type="question-circle" />
          TOTAL SUPPLY
        </div>
      ),
      value: <span>{totalSupply ? numberFormatter(totalSupply) : '-'}</span>,
    },
    {
      key: 'CIRCULATING SUPPLY',
      label: (
        <div>
          <IconFont className="mr-1" type="question-circle" />
          CIRCULATING SUPPLY
        </div>
      ),
      value: <span>{totalSupply ? numberFormatter(totalSupply) : '-'}</span>,
    },
    {
      key: 'HOLDERS',
      label: 'HOLDERS',
      value: (
        <div>
          <span>{totalSupply}</span>
          <span
            className={`${holderPercentChange24h?.toString().startsWith('-') ? 'text-rise-red' : 'text-fall-green'}`}>
            ({`${holderPercentChange24h?.toString().startsWith('-') ? '' : '+'}${holderPercentChange24h} `})
          </span>
        </div>
      ),
    },
    {
      key: 'TOTAL TRANSFERS',
      label: 'TOTAL TRANSFERS',
      value: <span>{totalTransfers}</span>,
    },
  ];

  const overviewInfoRight = [
    {
      key: 'PRICE',
      label: 'PRICE',
      value: (
        <div>
          <span>${priceInUsd}</span>
          <span
            className={`${pricePercentChange24h?.toString().startsWith('-') ? 'text-rise-red' : 'text-fall-green'}`}>
            ({`${pricePercentChange24h?.toString().startsWith('-') ? '' : '+'}${pricePercentChange24h}`})
          </span>
        </div>
      ),
    },
    {
      key: 'CONTRACT',
      label: (
        <div>
          <IconFont className="mr-1" type="question-circle" />
          <span>CONTRACT</span>
        </div>
      ),
      value: (
        <div>
          <IconFont type="Contract"></IconFont>
          <Link href={contractAddress} className="ml-1 text-link">
            {isMobile ? addressFormat(hiddenAddress(contractAddress)) : contractAddress}
          </Link>
          <Copy value={contractAddress}></Copy>
        </div>
      ),
    },
    {
      key: 'DECIMAL',
      label: 'DECIMAL',
      value: <span>{decimals}</span>,
    },
  ];

  const defaultIcon = <span className="default-icon">{tokenName.slice(0, 1).toUpperCase()}</span>;
  const items = [
    {
      key: '',
      label: 'Transfers',
      children: <Transfers SSRData={transfers} />,
    },
    {
      key: 'holders',
      label: 'Holders',
      children: <Holders SSRData={holders} />,
    },
  ];
  return (
    <div className="token-item-container">
      <HeadTitle
        className={isMobile && 'flex-col !items-start'}
        content={
          <div className="content">
            <ImageWithFallback src={tokenLogo} fallbackSrc={defaultIcon}></ImageWithFallback>
            <span className="name">Token{tokenName}</span>
            <span className="symbol">({tokenSymbol})</span>
          </div>
        }>
        <div className={clsx('code-box ml-2', isMobile && '!ml-0 flex items-center flex-wrap')}></div>
      </HeadTitle>
      <Overview title="Overview" leftItems={overviewInfoLeft} rightItems={overviewInfoRight}></Overview>
      <div className="mt-4 address-main">
        <EPTabs items={items} />
      </div>
    </div>
  );
}
