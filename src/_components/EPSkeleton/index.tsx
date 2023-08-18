/*
 * @author: Peterbjx
 * @Date: 2023-08-17 18:24:11
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-17 18:24:16
 * @Description: skeleton
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
