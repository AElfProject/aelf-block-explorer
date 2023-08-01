/*
 * @Author: aelf-lxy
 * @Date: 2023-08-01 20:31:39
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-01 20:33:26
 * @Description: empty
 */

'use client';

import { Provider as ReduxProvider } from 'react-redux';
import store from './_store';

export default function ThemeProvider({ children }) {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
}
