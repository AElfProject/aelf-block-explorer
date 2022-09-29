import { useEffect, useState } from 'react';
import { isPhoneCheck, isPhoneCheckSSR } from '../utils/deviceCheck';

export default function useMobile(ctx) {
  const [isMobile, setIsMobile] = useState(false);
  if (ctx) {
    isPhoneCheckSSR(ctx);
  }
  useEffect(() => {
    setIsMobile(isPhoneCheck());
  }, [location]);
  return !!isMobile;
}
