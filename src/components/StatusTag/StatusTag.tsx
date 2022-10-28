/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-09-29 17:14:01
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-28 15:18:40
 * @FilePath: /aelf-block-explorer/src/components/StatusTag/StatusTag.tsx
 * @Description: status tag
 */

import React, { useMemo } from 'react';
import IconFont from '../IconFont/index';

require('./StatusTag.style.less');

export default function StatusTag({ status }: { status: 'MINED' | 'FAILED' | 'PENDING' }) {
  const statusObj = useMemo(
    () => ({
      MINED: 'Success',
      FAILED: 'Failed',
      PENDING: 'Pending',
    }),
    [],
  );
  const iconObj = useMemo(
    () => ({
      MINED: 'CircleCorrect',
      FAILED: 'Failed',
      PENDING: 'Pending',
    }),
    [],
  );
  const { [status]: sta = 'NotExisted' } = statusObj;
  const { [status]: icon = 'CNotExisted' } = iconObj;
  return (
    <p className={`status-tag status-${sta.toLowerCase()}`}>
      <IconFont type={icon} /> {sta}
    </p>
  );
}
