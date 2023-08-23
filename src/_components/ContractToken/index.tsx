import Copy from '@_components/Copy';
import IconFont from '@_components/IconFont';
import { Tooltip } from 'antd';
import Link from 'next/link';

export default function ContractToken({ address }: { address: string }) {
  return (
    <div className="address">
      <IconFont className="mr-1 text-xs" type="Contract" />
      <Tooltip title={address} overlayClassName="table-item-tooltip-white">
        <Link href={`/address/${address}`}>{address}</Link>
      </Tooltip>
      <Copy value={address} />
    </div>
  );
}
