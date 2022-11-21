/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-09-29 17:14:01
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-28 14:53:58
 * @FilePath: /aelf-block-explorer/src/components/CodeBlock/CodeBlock.tsx
 * @Description: json format
 */
import React from 'react';

export default function CodeBlock({ value, rows = 8 }) {
  let jsonFormatted = value;
  try {
    jsonFormatted = JSON.stringify(JSON.parse(value), null, 4);
  } catch (e) {
    // do nothing
  }

  return <textarea rows={rows} value={jsonFormatted} className="tx-block-code-like-content" disabled />;
}
