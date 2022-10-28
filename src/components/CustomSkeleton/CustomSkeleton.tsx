/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-09-29 17:14:01
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-28 15:01:14
 * @FilePath: /aelf-block-explorer/src/components/CustomSkeleton/CustomSkeleton.tsx
 * @Description: skeleton and loading
 */
import { Skeleton } from 'antd';
import React from 'react';

export default function CustomSkeleton({ children, loading }) {
  return (
    <Skeleton active loading={loading}>
      {children}
    </Skeleton>
  );
}
