/*
 * @Author: aelf-lxy
 * @Date: 2023-08-01 20:31:39
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 15:02:03
 * @Description: empty
 */

'use client';

import { Provider as ReduxProvider } from 'react-redux';
import store from '@_store';
import { ConfigProvider } from 'antd';

export default function RootProvider({ children }) {
  return (
    <ConfigProvider>
      <ReduxProvider store={store}>{children}</ReduxProvider>
    </ConfigProvider>
  );
}
