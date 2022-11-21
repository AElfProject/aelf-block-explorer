/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-10-06 20:32:23
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-28 15:27:48
 * @FilePath: /aelf-block-explorer/src/hooks/useMobile.ts
 * @Description: only used in csr because cannot use location as dependency
 */
import { useEffect, useState } from 'react';
import { isPhoneCheck } from '../utils/deviceCheck';

export default function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(!!isPhoneCheck());
  }, [location]);

  return !!isMobile;
}
