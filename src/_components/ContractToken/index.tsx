import Copy from '@_components/Copy';
import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import Link from 'next/link';

export default function ContractToken({ address }: { address: string }) {
  return (
    <div className="address">
      <IconFont className="mr-1 text-xs" type="Contract" />
      <EPTooltip title={address} mode="dark" pointAtCenter={false}>
        <Link href={`/address/${address}`}>{address}</Link>
      </EPTooltip>
      <Copy value={address} />
    </div>
  );
}
