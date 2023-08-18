/*
 * @author: Peterbjx
 * @Date: 2023-08-17 17:52:47
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 17:52:55
 * @Description: code block
 */
import React from 'react';
import './index.css';

export default function CodeBlock({ value, rows = 8 }) {
  let jsonFormatted = value;
  try {
    jsonFormatted = JSON.stringify(JSON.parse(value), null, 4);
  } catch (e) {
    /* empty */
  }

  return <textarea rows={rows} value={jsonFormatted} className="tx-block-code-like-content" disabled />;
}
