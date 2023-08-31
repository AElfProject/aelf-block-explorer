'use client';
import Image from 'next/image';
import clsx from 'clsx';
import './index.css';
import { IExplorerItem, INetworkItem } from '@_types';
import Search from '@_components/Search';
import { IsMain } from '@_utils/isMainNet';
import { useEffect, useState } from 'react';
import { Card } from 'antd';
import MobileHeaderMenu from '@_components/MobileHeaderMenu';

// at public file
const TopIconMain = '/image/aelf-header-top.svg';
const TopIcoTest = '/image/aelf-header-top-test.svg';
const ChangeIconMain = '/image/aelf-header-top-change.svg';
const ChangeIcoTest = '/image/aelf-header-top-test-change.svg';
const NetworkType = process.env.NEXT_PUBLIC_NETWORK_TYPE;

const clsPrefix = 'header-top-container';
interface IProps {
  price: number;
  range: string;
  explorerList: IExplorerItem[];
  networkList: INetworkItem[];
  isMobile: boolean;
  isHideSearch: boolean;
}
export default function HeaderTop({ price, range, explorerList, isMobile, isHideSearch, networkList }: IProps) {
  const [showNetwork, setShowNetwork] = useState(false);
  const jumpLink = explorerList?.find((ele) => {
    return ele.netWorkType === NetworkType;
  })?.url;

  const clickIcon = () => {
    if (jumpLink) {
      window.location.href = jumpLink;
    }
  };
  const changeNetwork = (ele) => {
    if (ele.netWorkType !== NetworkType) {
      window.location.href = ele.url;
    }
  };
  useEffect(() => {
    const onHideContents = () => {
      setShowNetwork(false);
    };
    document.addEventListener('click', onHideContents);
    return () => {
      document.removeEventListener('click', onHideContents);
    };
  }, []);
  const showNetworkOptions = (event) => {
    event.nativeEvent.stopImmediatePropagation();
    setShowNetwork(!showNetwork);
  };
  return (
    <div className={clsx(clsPrefix, IsMain && `${clsPrefix}-main`, isMobile && `${clsPrefix}-mobile`)}>
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
                enterIcon={true}
                searchWrapClassNames={clsx(
                  'px-3',
                  'py-2',
                  'max-w-[509px]',
                  'rounded',
                  IsMain ? 'border-[#3A4668] bg-transparent' : 'border-D0 bg-F7 rounded',
                )}
                searchInputClassNames={clsx('!pl-0', IsMain && 'placeholder:!text-white !text-white')}
                placeholder={'Search by Address / Txn Hash / Block'}
                lightMode={!IsMain}
              />
            )}
            <div className={clsx(`${clsPrefix}-right`)}>
              <div className={clsx(`${clsPrefix}-explorer-change`)} onClick={showNetworkOptions}>
                <Image
                  className={`${clsPrefix}-change-icon`}
                  width="16"
                  height="16"
                  src={`${IsMain ? ChangeIconMain : ChangeIcoTest}`}
                  alt={'explorer-change-icon'}></Image>
              </div>
              {explorerList && showNetwork && (
                <Card>
                  {explorerList.map((ele) => {
                    return (
                      <p
                        key={ele.title}
                        onClick={() => changeNetwork(ele)}
                        className={ele.netWorkType === NetworkType ? `${clsPrefix}-icon-active` : ''}>
                        {ele.title}
                      </p>
                    );
                  })}
                </Card>
              )}
            </div>
          </>
        )}
        {isMobile && <MobileHeaderMenu networkList={networkList} explorerList={explorerList}></MobileHeaderMenu>}
      </div>
    </div>
  );
}
