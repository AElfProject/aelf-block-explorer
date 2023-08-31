/*
 * @author: Peterbjx
 * @Date: 2023-08-14 15:09:46
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 11:21:44
 * @Description: main container
 */

import clsx from 'clsx';
import React from 'react';

import './index.css';
const prefix = 'main-container';
export default function MainContainer({ children, isMobile }) {
  return <div className={clsx(prefix, isMobile && `${prefix}-mobile`)}>{children}</div>;
}
