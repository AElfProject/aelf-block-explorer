/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:37:10
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-09 19:52:47
 * @Description: home page
 */
import Link from 'next/link';
import Search from '@_components/Search';
import { TSearchValidator } from '@_components/Search/type';

const searchValidator: TSearchValidator = {
  default: {
    value: 0,
    limitNumber: 1,
  },
  token: {
    value: 1,
    limitNumber: 1,
  },
  account: {
    value: 2,
    limitNumber: 9,
  },
  contract: {
    value: 3,
    limitNumber: 2,
  },
};
export default function Home() {
  return (
    <main className="p-4 h-[3000px]">
      <div className="text-base-200">home page </div>

      <Link
        className="px-4 py-1 text-sm font-semibold text-purple-600 border border-purple-200 rounded-full hover:text-white hover:bg-base-100 hover:border-transparent "
        href="/address">
        Address
      </Link>
      <Link className="btn-primary" href="/blocks">
        blocks
      </Link>
      <Search searchValidator={searchValidator} />
    </main>
  );
}
