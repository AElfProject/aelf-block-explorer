/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:37:10
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-09 19:52:47
 * @Description: home page
 */
'use client';
import Image from 'next/image';
import InfoSection from './_components/InfoSection';
import Search from '@_components/Search';
import { TSearchValidator } from '@_components/Search/type';
import clsx from 'clsx';
import './index.css';
import { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder, HttpTransportType, LogLevel } from '@microsoft/signalr';
import { IOverviewSSR } from './type';
import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import Latest from './_components/Latest';
const BannerPc = '/image/banner_pc.png';
const BannerMobile = '/image/banner_mobile.png';
const clsPrefix = 'home-container';
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
const HOST = process.env.NEXT_PUBLIC_API_URL;
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
  overviewSSR: IOverviewSSR;
}
const getConnectionBuilder = (url: string) => {
  const connect = new HubConnectionBuilder()
    .withUrl(url, {
      skipNegotiation: true,
      transport: HttpTransportType.WebSockets,
    })
    // .withHubProtocol(new MessagePackHubProtocol())
    .withAutomaticReconnect()
    .build();
  return connect;
};
export default function Home({ isMobile, overviewSSR }: IProps) {
  const OverView: React.FC = () => {
    const [connection, setConnection] = useState<null | HubConnection>(null);
    const [overview, setOverView] = useState<IOverviewSSR>(overviewSSR);
    useEffect(() => {
      const connect = getConnectionBuilder(`${HOST}/signalr-hubs/overview`);
      setConnection(connect);
    }, []);
    useEffect(() => {
      setOverView({
        tokenPriceInUsd: 1,
        tokenPricePercent: '2',
        transactions: '3',
        tps: '4',
        reward: '5',
        blockHeight: 6,
        accounts: 7,
        citizenWelfare: '8',
      });
      //TODO
      // connection
      //   ?.start()
      //   .then(async () => {
      //     await connection.invoke('RequestOverview', {
      //       CHAIN_ID: CHAIN_ID,
      //     });
      //     connection.on('ReceiveOverview', ({ code, data }) => {
      //       if (code === '20000') {
      //         setOverView(data);
      //       }
      //     });
      //   })
      //   .catch((error) => console.log(error));
      // return () => {
      //   connection?.invoke('UnsubscribeOverview', {
      //     CHAIN_ID: CHAIN_ID,
      //   });
      // };
    }, [connection]);

    return <InfoSection isMobile={isMobile} overview={overview}></InfoSection>;
  };

  const LatestAll = () => {
    return (
      <div className="latest-all">
        <Latest></Latest>
        <Latest></Latest>
      </div>
    );
  };

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
      <OverView></OverView>
      <LatestAll></LatestAll>
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
