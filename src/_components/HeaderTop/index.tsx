'use client';
import Image from 'next/image';
import clsx from 'clsx';
import './index.css';
import { INetworkItem } from '@_types';
import Search from '@_components/Search';

// at public file
const TopIconMain = '/image/aelf-header-top.svg';
const TopIcoTest = '/image/aelf-header-top-test.svg';
const ChangeIconMain = '/image/aelf-header-top-change.svg';
const ChangeIcoTest = '/image/aelf-header-top-test-change.svg';
const NetworkType = process.env.NEXT_PUBLIC_NETWORK_TYPE;
const IsMain = process.env.NEXT_PUBLIC_NETWORK_TYPE === 'MAIN';

const clsPrefix = 'header-top-container';
interface IProps {
  price: number;
  range: string;
  networkList: INetworkItem[];
  isMobile: boolean;
  isHideSearch: boolean;
}
export default function HeaderTop({ price, range, networkList, isMobile, isHideSearch }: IProps) {
  const jumpLink = networkList?.find((ele) => {
    return ele.netWorkType === NetworkType;
  })?.url;
  const jumpOtherLink = networkList?.find((ele) => {
    return ele.netWorkType !== NetworkType;
  })?.url;
  const clickIcon = () => {
    if (jumpLink) {
      window.location.href = jumpLink;
    }
  };
  const changeNetwork = () => {
    if (jumpOtherLink) {
      window.location.href = jumpOtherLink;
    }
  };
  return (
    <div className={clsx(clsPrefix, `${clsPrefix}__main`, isMobile && `${clsPrefix}__mobile`)}>
      <div className={clsx(`${clsPrefix}-content`)}>
        <Image
          className={clsx(`${clsPrefix}-icon`)}
          src={`${IsMain ? TopIconMain : TopIcoTest}`}
          alt={'top-icon'}
          width="96"
          height="32"
          onClick={clickIcon}></Image>
        {!isMobile && (
          <>
            <div className={clsx(`${clsPrefix}-price`)}>
              <span className="title">ELF Price</span>
              <span className="price">${price}</span>
              <span className={clsx(`${range.startsWith('+') ? 'text-rise-red' : 'text-fall-green'}`, 'range')}>
                {range}
              </span>
            </div>

            {!isHideSearch && (
              <Search
                searchIcon={true}
                searchButton={false}
                // searchWrapClassNames={'px-3 py-2 border-D0 bg-F7 w-[511px] rounded'}
                searchWrapClassNames={'px-3 py-2 border-[#3A4668] bg-transparent w-[509px] rounded'}
                // searchInputClassNames={'!pl-0 placeholder:!text-base-200'}
                searchInputClassNames={'!pl-0 placeholder:!text-white !text-white'}
                placeholder={'Search by Address / Txn Hash / Block'}
              />
            )}
            <div className={clsx(`${clsPrefix}-network-change`)} onClick={changeNetwork}>
              <Image
                className={`${clsPrefix}-change-icon`}
                width="16"
                height="16"
                src={`${IsMain ? ChangeIconMain : ChangeIcoTest}`}
                alt={'network-change-icon'}></Image>
            </div>
          </>
        )}
        {isMobile && <div>mobile-menu</div>}
      </div>
    </div>
  );
}
