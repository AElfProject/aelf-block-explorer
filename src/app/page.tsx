/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:37:10
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-04 17:53:15
 * @Description: home page
 */
import Link from 'next/link';
import Search from '@_components/Search';
export default function Home() {
  return (
    <main className="p-4">
      <div className="text-base-200">home page </div>

      <Link
        className="px-4 py-1 text-sm text-purple-600 font-semibold rounded-full border border-purple-200 hover:text-white hover:bg-aaa hover:border-transparent "
        href="/address">
        Address
      </Link>
      <Link className="btn-primary" href="/blocks">
        blocks
      </Link>
      <Search />
    </main>
  );
}
