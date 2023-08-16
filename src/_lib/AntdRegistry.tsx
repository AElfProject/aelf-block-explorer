/*
 * @Author: aelf-lxy
 * @Date: 2023-08-10 14:59:15
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:03:10
 * @Description: Extract the antd first screen style as needed and implant it into HTML to avoid page flickering
 */
'use client';

import React from 'react';
import { StyleProvider, createCache, extractStyle } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';

const StyledComponentsRegistry = ({ children }: { children: React.ReactNode }) => {
  const cache = createCache();
  useServerInsertedHTML(() => <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />);
  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

export default StyledComponentsRegistry;
