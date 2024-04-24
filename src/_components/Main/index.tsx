/*
 * @author: Peterbjx
 * @Date: 2023-08-14 15:09:46
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 11:21:44
 * @Description: main container
 */
'use client';
import React from 'react';
import './index.css';
import clsx from 'clsx';
import { useMobileAll } from '@_hooks/useResponsive';
export default function MainContainer({ children, isMobileSSR }) {
  const isMobile = useMobileAll();
  return <div className={clsx(isMobile && 'main-container-mobile', 'main-container')}>{children}</div>;
}
