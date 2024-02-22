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
export default function Header({ chainInfos, netInfos, headerMenuList }) {
  const { isMobile } = useResponsive();
  const { chainList, currentChain } = chainInfos;
  useInit(chainList, currentChain);
  return (
    <div className={clsx(clsPrefix)}>
      <HeaderTop price={100} range={'99'} netInfos={netInfos} headerMenuList={headerMenuList} />
      {!isMobile && <HeaderMenu headerMenuList={headerMenuList} netInfos={netInfos} />}
    </div>
  );
}
