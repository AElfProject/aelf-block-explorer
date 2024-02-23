'use client';
import { useIsGovernance } from '@_hooks/useIsPath';
import { Skeleton } from 'antd';
export default function Loading() {
  const isGovernance = useIsGovernance();
  return !isGovernance && <Skeleton className="main-skeleton top-[104px] h-[calc(100vh-474px)]" />;
}
