'use client';
import clsx from 'clsx';
import './index.css';

import IconFont from '@_components/IconFont';
import { IOverviewSSR } from '@app/home/type';
const clsPrefix = 'home-info-section';
interface IProps {
  isMobile: boolean;
  overview: IOverviewSSR;
}

export default function infoSection({ isMobile, overview }: IProps) {
  return (
    <div className={clsx(`${clsPrefix}`, isMobile && `${clsPrefix}__mobile`)}>
      <div className={`${clsPrefix}-col-item`}>
        <div className={clsx(`${clsPrefix}-row-item`, `${clsPrefix}-price`)}>
          <IconFont type="elf-price"></IconFont>
          <div className="content">
            <span className="title">Price</span>
            <span className="desc">{overview.tokenPriceInUsd}</span>
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
}
