import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
export const useIsGovernance = () => {
  const pathname = usePathname();
  const isGovernance = useMemo(() => {
    return ['/proposal', '/vote', '/resource'].find((ele) => pathname.startsWith(ele));
  }, [pathname]);
  return isGovernance;
};
