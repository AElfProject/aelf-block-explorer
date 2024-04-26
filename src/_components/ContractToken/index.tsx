import Copy from '@_components/Copy';
import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import { AddressType } from '@_types/common';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Link from 'next/link';

export default function ContractToken({ address, name, type }: { address: string; name?: string; type: AddressType }) {
  return type === AddressType.address ? (
    <div className="address flex items-center">
      <EPTooltip pointAtCenter={false} title={addressFormat(address)} mode="dark">
        <Link className="text-link" href={`/address/${addressFormat(address)}`}>
          {addressFormat(hiddenAddress(address, 4, 4))}
        </Link>
      </EPTooltip>
      <Copy value={addressFormat(address)} />
      <div className="flex items-center"></div>
    </div>
  ) : (
    <div className="address">
      <IconFont className="mr-1 text-xs" type="Contract" />
      <EPTooltip
        title={
          <div>
            <div>Contract Name:{name}</div>
            <div>({addressFormat(address)})</div>
          </div>
        }
        mode="dark"
        pointAtCenter={false}>
        <Link href={`/address/${address}`}>{name}</Link>
      </EPTooltip>
      <Copy value={addressFormat(address)} />
    </div>
  );
}
