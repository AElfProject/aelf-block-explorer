import React, { useEffect } from 'react';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';

require('./TableLayer.styles.less');
export default function TableLayer({ children, className = '', ...props }) {
  let isMobile = !!isPhoneCheckSSR(props.headers);
  useEffect(() => {
    isMobile = !!isPhoneCheck();
  }, []);
  return (
    <div className={'table-layer ' + (isMobile ? 'mobile ' : '') + className} {...props}>
      <div className="table-layer-block" />
      {children}
      <div className="table-layer-block" />
    </div>
  );
}
