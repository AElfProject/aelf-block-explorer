import AccountsList from './list';
import fetchData from './mock';
export default async function AccountsPage() {
  const data = await fetchData({ page: 1, pageSize: 25 });
  return <AccountsList SSRData={data} />;
}
