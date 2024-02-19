'use client';
import React from 'react';
import HeaderTop from '@_components/HeaderTop';
import HeaderMenu from '@_components/HeaderMenu';
import './index.css';
import clsx from 'clsx';
import useInit from '@_hooks/useInit';

const clsPrefix = 'header-container';
export default function Header({ chainArr, currentChain, mainNetUrl, sideNetUrl }) {
  useInit(chainArr, currentChain);
  return (
    <div className={clsx(clsPrefix)}>
      <HeaderTop price={100} range={'99'} mainNetUrl={mainNetUrl} sideNetUrl={sideNetUrl} />
      <HeaderMenu />
    </div>
  );
}
