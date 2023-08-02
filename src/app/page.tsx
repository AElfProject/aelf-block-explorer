/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:37:10
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-02 14:52:32
 * @Description: home page
 */
import Link from 'next/link';
export default function Home() {
  return (
    <main>
      <div>home page </div>
      <Link className="bg-emerald-400" href="/address">
        Address
      </Link>
      <Link className="bg-pink-500" href="/blocks">
        blocks
      </Link>
    </main>
  );
}
