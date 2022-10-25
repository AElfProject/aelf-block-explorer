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
