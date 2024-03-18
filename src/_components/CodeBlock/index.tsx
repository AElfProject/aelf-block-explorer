/*
 * @author: Peterbjx
 * @Date: 2023-08-17 17:52:47
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 17:52:55
 * @Description: code block
 */
import React from 'react';
import './index.css';
import TextArea from 'antd/es/input/TextArea';

export default function CodeBlock({ value, rows = 8, ...params }) {
  let jsonFormatted = value;
  try {
    jsonFormatted = JSON.stringify(JSON.parse(value), null, 4);
  } catch (e) {
    /* empty */
  }

  return <TextArea rows={rows} value={jsonFormatted} className="tx-block-code-like-content" readOnly {...params} />;
}
