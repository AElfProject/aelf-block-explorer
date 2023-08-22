/*
 * @Author: aelf-lxy
 * @Date: 2023-08-02 14:46:36
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 15:49:51
 * @Description: header
 */
'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { isMobileDevices } from '@_utils/isMobile';
import HeaderTop from '@_components/HeaderTop';
import HeaderMenu from '@_components/HeaderMenu';

const NETWORK_TYPE = process.env.NEXT_PUBLIC_NETWORK_TYPE;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
const NETWORK_LIST = [
  {
    title: 'AELF Mainnet',
    url: 'https://explorer.aelf.io',
    netWorkType: 'MAIN',
  },
  {
    title: 'AELF Testnet',
    url: 'https://explorer-test.aelf.io',
    netWorkType: 'TESTNET',
  },
];
let jumpFlag = false;
export default function Header({ priceSSR, previousPriceSSR, isMobileSSR }) {
  const [showSearch, setShowSearch] = useState(true);
  const onlyMenu = useMemo(() => {
    return showSearch ? '' : 'only-menu ';
  }, [showSearch]);
  const [isMobile, setIsMobile] = useState(isMobileSSR);
  const isMainNet = process.env.NEXT_PUBLIC_NETWORK_TYPE === 'MAIN' ? 'main-net' : 'test-net';
  const [price, setPrice] = useState(priceSSR);
  const [previousPrice, setPreviousPrice] = useState(previousPriceSSR);
  const pathname = usePathname();
  const isHideSearch = pathname === '/' || pathname.includes('search-');
  useEffect(() => {
    setIsMobile(isMobileDevices());
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      const { price: p, previousPrice: prevP } = {
        price: { USD: 1 },
        previousPrice: { usd: 2 },
      };
      if (CHAIN_ID === 'AELF' && NETWORK_TYPE === 'MAIN' && !isMobile) {
        setPrice(p);
        setPreviousPrice(prevP);
        jumpFlag = true;
      }
    };
    // include headertop and home page
    if (window.location.pathname === '/') {
      fetchData();
    } else if (CHAIN_ID === 'AELF' && NETWORK_TYPE === 'MAIN' && !isMobile) {
      // only once
      if (!jumpFlag) {
        fetchData();
      }
    }
  }, [pathname, isMobile]);
  const range = useMemo(() => {
    if (price.USD && previousPrice.usd) {
      const res = ((price.USD - previousPrice.usd) / previousPrice.usd) * 100;
      return `${res >= 0 ? '+' : ''}${res}%`;
    }
    return '-';
  }, [price, previousPrice]);
  const getSearchStatus = () => {
    let showSearch = false;
    // don't show search -> home page | search-*
    // show search -> other pages
    if (pathname === '/' || pathname.includes('search-')) {
      showSearch = false;
    } else {
      showSearch = true;
    }
    return showSearch;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.location.pathname === '/') {
        setShowSearch(getSearchStatus());
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`header-container ${onlyMenu}${isMainNet}`}>
      <div>
        {
          <HeaderTop
            price={price.USD}
            range={range}
            networkList={NETWORK_LIST}
            isMobile={isMobile}
            isHideSearch={isHideSearch}></HeaderTop>
        }
        {!isMobile && <HeaderMenu isMobile={isMobile}></HeaderMenu>}
      </div>
    </div>
  );
}
