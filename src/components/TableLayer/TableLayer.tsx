/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-10-25 13:48:07
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-28 15:23:05
 * @FilePath: /aelf-block-explorer/src/components/TableLayer/TableLayer.tsx
 * @Description: table layer different in pc and mobile
 */
import React, { useEffect, useState } from 'react';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';

require('./TableLayer.styles.less');
export default function TableLayer({ children, className = '', ...props }) {
  const [isMobile, setIsMobile] = useState(!!isPhoneCheckSSR(props.headers));

  useEffect(() => {
    setIsMobile(!!isPhoneCheck());
  }, []);
  return (
    <div className={'table-layer ' + (isMobile ? 'mobile ' : '') + className} {...props}>
      <div className="table-layer-block" />
      {children}
      <div className="table-layer-block" />
    </div>
  );
}
