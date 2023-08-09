/*
 * @author: Peterbjx
 * @Date: 2023-08-15 15:58:11
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 16:36:16
 * @Description: transactions
 */

import TransactionsList from './list';
import { headers } from 'next/headers';
import { isMobileOnServer } from '@_utils/isMobile';
export default function BlocksPage() {
  const headersList = headers();
  const isMobile = isMobileOnServer(headersList);
  return <TransactionsList isMobileSSR={isMobile} />;
}
