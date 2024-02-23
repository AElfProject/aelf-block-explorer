'use client';
import Image from 'next/image';
import clsx from 'clsx';
import './index.css';
import Search from '@_components/Search';
import { isMainNet } from '@_utils/isMainNet';
import MobileHeaderMenu from '@_components/MobileHeaderMenu';
import { usePathname } from 'next/navigation';
import { useAppSelector } from '@_store';
import useResponsive from '@_hooks/useResponsive';
import { MenuItem, NetworkItem } from '@_types';

// at public file
const TopIconMain = '/image/aelf-header-top.svg';
const TopIcoTest = '/image/aelf-header-top-test.svg';
const ChangeIconMain = '/image/aelf-header-top-change.svg';
const ChangeIcoTest = '/image/aelf-header-top-test-change.svg';

const clsPrefix = 'header-top-container';
interface IProps {
  price: number;
  range: string;
  networkList: NetworkItem[];
  headerMenuList: MenuItem[];
}
export default function HeaderTop({ price, range, networkList, headerMenuList }: IProps) {
  const { isMobile } = useResponsive();
  const { defaultChain } = useAppSelector((state) => state.getChainId);
  const isShowPrice = defaultChain === 'AELF' && isMainNet;
  const pathname = usePathname();
  const isHideSearch = pathname === '/' || pathname.includes('search-');
  const networkType = process.env.NEXT_PUBLIC_NETWORK_TYPE;
  const finalUrl = networkList.find((ele) => ele.key === networkType)?.path;

  return (
    <div className={clsx(clsPrefix, isMainNet && `${clsPrefix}-main`, isMobile && `${clsPrefix}-mobile`)}>
      <div className={clsx(`${clsPrefix}-content`)}>
        <Image
          className={clsx(`${clsPrefix}-icon`)}
          src={`${isMainNet ? TopIconMain : TopIcoTest}`}
          alt={'top-icon'}
          width="96"
          height="32"
        />
        <>
          {isShowPrice && (
            <div className={clsx(`${clsPrefix}-price`)}>
              <span className="title">ELF Price</span>
              <span className="price">${price}</span>
              <span className={clsx(`${range.startsWith('+') ? 'text-rise-red' : 'text-fall-green'}`, 'range')}>
                {range}
              </span>
            </div>
          )}

          {/* {!isHideSearch && (
            <Search
              searchIcon={true}
              searchButton={false}
              enterIcon={true}
              searchWrapClassNames={clsx(
                'px-3',
                'py-2',
                'max-w-[509px]',
                'rounded',
                isMainNet ? 'border-[#3A4668] bg-transparent' : 'rounded border-D0 bg-F7',
              )}
              searchInputClassNames={clsx('!pl-0', isMainNet && '!text-white placeholder:!text-white')}
              placeholder={'Search by Address / Txn Hash / Block'}
              lightMode={!isMainNet}
            />
          )} */}
          <div className={clsx(`${clsPrefix}-right`)} onClick={() => (window.location.href = finalUrl)}>
            <div className={clsx(`${clsPrefix}-explorer-change`)}>
              <Image
                className={`${clsPrefix}-change-icon`}
                width="16"
                height="16"
                src={`${isMainNet ? ChangeIconMain : ChangeIcoTest}`}
                alt={'explorer-change-icon'}></Image>
            </div>
          </div>
        </>
        {isMobile && <MobileHeaderMenu headerMenuList={headerMenuList} networkList={networkList} />}
      </div>
    </div>
  );
}
