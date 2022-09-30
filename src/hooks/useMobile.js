import { useEffect, useState } from 'react';
import { isPhoneCheck } from '../utils/deviceCheck';

export default function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  // cannot use location as dependency
  useEffect(() => {
    setIsMobile(isPhoneCheck());
  }, []);

  return !!isMobile;
}
