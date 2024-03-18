import Copy from '@_components/Copy';
import addressFormat, { hiddenAddress } from '@_utils/urlUtils';
import Link from 'next/link';
import { useMemo } from 'react';

export interface IAddressWithCopyProps {
  address: string;
  hidden?: boolean;
}

const AddressWithCopy = ({ address, hidden }: IAddressWithCopyProps) => {
  const addressStr = useMemo(() => {
    const str = hidden ? hiddenAddress(address, 4, 4) : address;
    return addressFormat(str);
  }, [address, hidden]);
  return (
    <>
      <Link className="text-link" href={`/address/${addressFormat(address)}`}>
        {addressStr}
      </Link>
      <Copy value={addressFormat(address)} />
    </>
  );
};

export default AddressWithCopy;
