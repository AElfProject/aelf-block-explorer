/*
 * @author: Peterbjx
 * @Date: 2023-08-16 16:02:25
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:02:43
 * @Description:
 */
'use client';
import clsx from 'clsx';
import './index.css';
import IconFont from '@_components/IconFont';
import BackToTopButton from '@_components/BackToTopBtn';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { isMobileDevices } from '@_utils/isMobile';
import { isMainNet } from '@_utils/isMainNet';
import useResponsive, { useMobileAll } from '@_hooks/useResponsive';
import { MenuItem } from '@_types';
const FoorterBgTets = '/image/footer-bg.png';
const clsPrefix = 'footer-container';
interface IProps {
  isMobileSSR: boolean;
  footerMenuList: {
    footerMenu_id: MenuItem;
  }[];
}
export default function Footer({ isMobileSSR, footerMenuList }: IProps) {
  const isMobile = useMobileAll();
  const rightLinkCom = footerMenuList.map((ele) => {
    const item = ele.footerMenu_id;
    const subItem = item.children.map((element) => {
      return (
        <span className="text" onClick={() => (window.location.href = element.path)} key={element.label}>
          {element.label}
        </span>
      );
    });
    return (
      <div className={item.key} key={item.key}>
        <span className="title" onClick={() => (window.location.href = item.path)} key={item.label}>
          {item.label}
        </span>
        {subItem}
      </div>
    );
  });
  return (
    <div className={clsx(clsPrefix, isMainNet && `${clsPrefix}-main`, isMobile && `${clsPrefix}-mobile`)}>
      {!isMainNet && (
        <Image src={`${FoorterBgTets}`} alt={''} width="1400" height="330" className={`${clsPrefix}-bg`}></Image>
      )}
      <div className={clsx(`${clsPrefix}-wrapper`)}>
        <div className={`${clsPrefix}-content`}>
          <div className="left">
            <div className="title">
              <IconFont type={isMainNet ? 'aelf-header-top-change' : 'aelf-header-top-test-change'}></IconFont>
              <span className="text">Powered by AELF</span>
            </div>
            <div className="description">
              AELF Explorer is a Block Explorer and Analytics Platform for AELF, a decentralized cloud computing
              blockchain explorer.
            </div>
          </div>
          <div className="right">{rightLinkCom}</div>
        </div>
        <BackToTopButton isDark={isMainNet}></BackToTopButton>
        <div className={`${clsPrefix}-link`}>
          <IconFont type="telegram" onClick={() => (window.location.href = 'https://t.me/aelfblockchain')}></IconFont>
          <IconFont
            type="medium"
            onClick={() => (window.location.href = 'https://medium.com/aelfblockchain')}></IconFont>
          <IconFont
            type="twitter"
            onClick={() => (window.location.href = 'https://twitter.com/aelfblockchain')}></IconFont>
          <IconFont
            type="youtube"
            onClick={() => (window.location.href = 'http://www.youtube.com/c/aelfblockchain')}></IconFont>
          <IconFont type="discord" onClick={() => (window.location.href = 'https://discord.gg/bgysa9xjvD')}></IconFont>
        </div>
      </div>
      <div className="copywrite">AELF © {new Date().getFullYear()}</div>
    </div>
  );
}
