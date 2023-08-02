/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 15:38:58
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 14:34:19
 * @Description: TopAccounts List
 */

import { Suspense } from 'react';
import List from './_components/List';
import Loading from './loading';

export default function TopAccounts() {
  return (
    <>
      <div>列表</div>
      <Suspense fallback={<Loading />}>
        <List />
      </Suspense>
    </>
  );
}
