import Copy from '@_components/Copy';
import EPTooltip from '@_components/EPToolTip';
import IconFont from '@_components/IconFont';
import { AddressType } from '@_types/common';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Link from 'next/link';

export default function ContractToken({
  address,
  name,
  type,
  chainId,
}: {
  address: string;
  name?: string;
  type: AddressType;
  chainId: string;
}) {
  return type === AddressType.address ? (
    <div className="address flex items-center">
      <EPTooltip pointAtCenter={false} title={addressFormat(address, chainId)} mode="dark">
        <Link className="text-link" href={`/${chainId}/address/${addressFormat(address, chainId)}`}>
          {addressFormat(hiddenAddress(address, 4, 4), chainId)}
        </Link>
      </EPTooltip>
      <Copy value={addressFormat(address, chainId)} />
      <div className="flex items-center"></div>
    </div>
  ) : (
    <div className="address">
      <IconFont className="mr-1 text-xs" type="Contract" />
      <EPTooltip
        title={
          <div>
            <div>Contract Name:{name}</div>
            <div>({addressFormat(address, chainId)})</div>
          </div>
        }
        mode="dark"
        pointAtCenter={false}>
        <Link href={`/${chainId}/address/${addressFormat(address, chainId)}`}>{name}</Link>
      </EPTooltip>
      <Copy value={addressFormat(address, chainId)} />
    </div>
  );
}
