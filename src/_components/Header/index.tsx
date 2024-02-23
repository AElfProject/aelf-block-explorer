'use client';
import React from 'react';
import HeaderTop from '@_components/HeaderTop';
import HeaderMenu from '@_components/HeaderMenu';
import './index.css';
import clsx from 'clsx';
import useInit from '@_hooks/useInit';
import { useMobileContext } from '@app/pageProvider';
import useResponsive from '@_hooks/useResponsive';

const clsPrefix = 'header-container';
export default function Header({ chainList, networkList, headerMenuList, defaultChain }) {
  const { isMobile } = useResponsive();
  const chainArr = chainList.map((ele) => ele.chainList_id);
  useInit(chainArr, defaultChain);
  const headerList = headerMenuList.map((ele) => ele.headerMenu_id);
  const networkArr = networkList.map((ele) => ele.network_id);
  return (
    <div className={clsx(clsPrefix)}>
      <HeaderTop price={100} range={'99'} networkList={networkList} headerMenuList={headerList} />
      {!isMobile && <HeaderMenu headerMenuList={headerList} networkList={networkArr} />}
    </div>
  );
}
