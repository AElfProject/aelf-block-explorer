/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:37:10
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-09 19:52:47
 * @Description: home page
 */
import { isMobileOnServer } from '@_utils/isMobile';
import { headers } from 'next/headers';
import Home from './home/page';

export default function HomePage() {
  const headersList = headers();
  const isMobile = isMobileOnServer(headersList);
  return <Home isMobile={isMobile}></Home>;
}
