import AccountsList from './list';
import { headers } from 'next/headers';
import { isMobileOnServer } from '@_utils/isMobile';
export default function AccountsPage() {
  const headersList = headers();
  const isMobile = isMobileOnServer(headersList);
  return <AccountsList isMobileSSR={isMobile} />;
}
