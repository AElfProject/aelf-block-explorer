'use client';
import React, { useEffect, useState } from 'react';
import HeaderTop from '@_components/HeaderTop';
import HeaderMenu from '@_components/HeaderMenu';
import './index.css';
import clsx from 'clsx';
import { useMobileAll } from '@_hooks/useResponsive';
import { useAppDispatch } from '@_store';
import { setChainArr, setDefaultChain } from '@_store/features/chainIdSlice';

const clsPrefix = 'header-container';
export default function Header({ chainList, networkList, headerMenuList, defaultChain }) {
  const isMobile = useMobileAll();
  const chainArr = chainList.map((ele) => ele.chainList_id);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setChainArr(chainArr));
    dispatch(setDefaultChain(defaultChain));
  }, [chainArr, defaultChain]);
  const headerList = headerMenuList.map((ele) => ele.headerMenu_id);
  const networkArr = networkList.map((ele) => ele.network_id);
  return (
    <div className={clsx(clsPrefix)}>
      <HeaderTop price={100} range={'99'} networkList={networkList} headerMenuList={headerList} />
      {!isMobile && <HeaderMenu headerMenuList={headerList} networkList={networkArr} />}
    </div>
  );
}
