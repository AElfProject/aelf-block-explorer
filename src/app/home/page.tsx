/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:37:10
 * @LastEditors: Peterbjx
 * @LastEditTime: 2023-08-16 16:02:10
 * @Description: home page
 */
import Image from 'next/image';
import Link from 'next/link';
import Search from '@_components/Search';
import { TSearchValidator } from '@_components/Search/type';
import clsx from 'clsx';
import './index.css';
const BannerPc = '/image/banner_pc.png';
const BannerMobile = '/image/banner_mobile.png';
const clsPrefix = 'home-container';
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
interface IProps {
  isMobile: boolean;
}
export default function Home({ isMobile }: IProps) {
  return (
    <main className={clsx(`${clsPrefix}`, isMobile && `${clsPrefix}-mobile`)}>
      <div className="banner-section">
        {isMobile ? (
          <Image
            src={BannerMobile}
            layout="fill"
            objectFit="contain"
            objectPosition={'0 top'}
            priority
            alt="Picture of the banner mobile"></Image>
        ) : (
          <Image src={BannerPc} layout="fill" objectFit="contain" priority alt="Picture of the banner"></Image>
        )}
        <h2>AELF Explorer</h2>
        <Search searchValidator={searchValidator} />
      </div>

      {/* <Link
        className="px-4 py-1 text-sm font-semibold text-purple-600 border border-purple-200 rounded-full hover:text-white hover:bg-base-100 hover:border-transparent "
        href="/address">
        Address
      </Link>
      <Link className="btn-primary" href="/blocks">
        blocks
      </Link> */}
    </main>
  );
}
