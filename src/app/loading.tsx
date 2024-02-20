'use client';
import { Skeleton } from 'antd';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
export default function Loading() {
  // return <div className="h-[100vh]">loading...</div>;
  const pathname = usePathname();
  const isGovernance = useMemo(() => {
    return ['/proposal', '/vote', '/resource'].find((ele) => pathname.startsWith(ele));
  }, [pathname]);
  return !isGovernance && <Skeleton className="main-skeleton top-[104px] h-[calc(100vh-514px)]" />;
}
