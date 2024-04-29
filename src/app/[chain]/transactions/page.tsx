/*
 * @author: Peterbjx
 * @Date: 2023-08-15 15:58:11
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-15 16:36:16
 * @Description: transactions
 */

import { fetchServerTransactionList } from '@_api/fetchTransactions';
import TransactionsList from './list';
export default async function BlocksPage({ params }) {
  const { chain } = params;
  const data = await fetchServerTransactionList({
    chainId: chain,
    skipCount: 0,
    maxResultCount: 25,
    cache: 'no-store',
  });
  return <TransactionsList SSRData={data} />;
}

export const revalidate = 1;
export const dynamic = 'force-dynamic';
