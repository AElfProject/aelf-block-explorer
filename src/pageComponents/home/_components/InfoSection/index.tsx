'use client';
import clsx from 'clsx';
import './index.css';

import IconFont from '@_components/IconFont';
import { IOverviewSSR } from '@pageComponents/home/type';
import { useEffect, useState } from 'react';
const clsPrefix = 'home-info-section';
interface IProps {
  isMobile: boolean;
  overview: IOverviewSSR;
}

const InfoSection = ({ isMobile, overview }: IProps) => {
  const [range, setRange] = useState('');
  useEffect(() => {
    setRange(overview.tokenPricePercent);
  }, [overview]);
  return (
    <div className={clsx(`${clsPrefix}`, isMobile && `${clsPrefix}-mobile`)}>
      <div className={`${clsPrefix}-col-item`}>
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-price`)}>
          <IconFont type="elf-price"></IconFont>
          <div className="content">
            <span className="title">Price</span>
            <span className="desc">
              {overview.tokenPriceInUsd || '-'}
              <span className={clsx('range', +range >= 0 ? 'rise' : 'fall')}>
                ({+range >= 0 ? '+' : ''}
                {(+range)?.toFixed(2)}%)
              </span>
            </span>
          </div>
        </div>
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-height`)}>
          {' '}
          <IconFont type="confirmed-blocks"></IconFont>
          <div className="content">
            <span className="title">Block Height</span>
            <span className="desc">{overview.blockHeight}</span>
          </div>
        </div>
      </div>
      <div className={`${clsPrefix}-col-item`}>
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-transaction`)}>
          {' '}
          <IconFont type="transactions"></IconFont>
          <div className="content">
            <span className="title">Transactions</span>
            <span className="desc">{overview.transactions}</span>
          </div>
        </div>
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-accounts`)}>
          {' '}
          <IconFont type="account"></IconFont>
          <div className="content">
            <span className="title">Accounts</span>
            <span className="desc">{overview.accounts}</span>
          </div>
        </div>
      </div>
      <div className={`${clsPrefix}-col-item`}>
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-reward`)}>
          {' '}
          <IconFont type="reward-dollar"></IconFont>
          <div className="content">
            <span className="title">Reward</span>
            <span className="desc">{overview.reward}</span>
          </div>
        </div>
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-walfare`)}>
          {' '}
          <IconFont type="citizen-welfare"></IconFont>
          <div className="content">
            <span className="title">Citizen Welfare</span>
            <span className="desc">{overview.citizenWelfare}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InfoSection;
