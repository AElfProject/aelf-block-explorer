/*
 * @author: Peterbjx
 * @Date: 2023-08-14 15:09:46
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 11:21:44
 * @Description: main container
 */

import React from 'react';

import './index.css';
import clsx from 'clsx';
export default function MainContainer({ children, isMobileSSR }) {
  console.log(children, 'children');
  return <div className={clsx(isMobileSSR && 'main-container-mobile', 'main-container')}>{children}</div>;
}
