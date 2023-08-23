/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:37:10
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-17 17:28:28
 * @Description: home page
 */
'use client';
import Image from 'next/image';
import InfoSection from './_components/InfoSection';
import SearchComp from './_components/SearchWithClient';
import clsx from 'clsx';
import './index.css';
import { useEffect, useState } from 'react';
import { HubConnection, HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';
import { IOverviewSSR } from './type';
// import { MessagePackHubProtocol } from '@microsoft/signalr-protocol-msgpack';
import Latest from './_components/Latest';
import TPSChart from './_components/TPSChart';
import tpsData from './mock';
const BannerPc = '/image/banner_pc.png';
const BannerMobile = '/image/banner_mobile.png';
const clsPrefix = 'home-container';
// const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID;
const HOST = process.env.NEXT_PUBLIC_API_URL;

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
    const blocks = [
      {
        blockHeight: 123123123123,
        timestamp: '1111111',
        txns: 222,
        reward: '123',
        producer: {
          name: 'hehehehehehehehehehehehehehe',
          address: 'www.baidu.com',
        },
      },
      {
        blockHeight: 1,
        timestamp: '1111111',
        txns: 222,
        reward: '123',
        producer: {
          name: 'hehehehehehehehehehehehehehe',
          address: 'www.baidu.com',
        },
      },
      {
        blockHeight: 2,
        timestamp: '1111111',
        txns: 222,
        reward: '123',
        producer: {
          name: 'hehehehehehehehehehehehehehe',
          address: 'www.baidu.com',
        },
      },
      {
        blockHeight: 3,
        timestamp: '1111111',
        txns: 222,
        reward: '123',
        producer: {
          name: 'hehehehehehehehehehehehehehe',
          address: 'www.baidu.com',
        },
      },
      {
        blockHeight: 4,
        timestamp: '1111111',
        txns: 222,
        reward: '123',
        producer: {
          name: 'hehehehehehehehehehehehehehe',
          address: 'www.baidu.com',
        },
      },
      {
        blockHeight: 1234,
        timestamp: '1111111',
        txns: 222,
        reward: '123',
        producer: {
          name: 'hehe',
          address: 'www.baidu.com',
        },
      },
      {
        blockHeight: 123456,
        timestamp: '1111111',
        txns: 222,
        reward: '123',
        producer: {
          name: 'hehe',
          address: 'www.baidu.com',
        },
      },
    ];
    const transactions = [
      {
        id: 1,
        transactionHash: '111111113903740370',
        from: '2HxX36oXZS89Jvz7kCeUyuWWDXLTiNRkAzfx3EuXq4KSSkH62W',
        to: '2HxX36oXZS89Jvz7kCeUyuWWDXLTiNRkAzfx3EuXq4KSSkH62W',
        timestamp: 1279407412740,
        txnValue: 1.23,
      },
      {
        id: 2,
        transactionHash: '111111113903740370',
        from: '2HxX36oXZS89Jvz7kCeUyuWWDXLTiNRkAzfx3EuXq4KSSkH62W',
        to: '2HxX36oXZS89Jvz7kCeUyuWWDXLTiNRkAzfx3EuXq4KSSkH62W',
        timestamp: 1279407412740,
        txnValue: 1.23,
      },
      {
        id: 3,
        transactionHash: '111111113903740370',
        from: '2HxX36oXZS89Jvz7kCeUyuWWDXLTiNRkAzfx3EuXq4KSSkH62W',
        to: '2HxX36oXZS89Jvz7kCeUyuWWDXLTiNRkAzfx3EuXq4KSSkH62W',
        timestamp: 1279407412740,
        txnValue: 1.23,
      },
      {
        id: 4,
        transactionHash: '111111113903740370',
        from: '2HxX36oXZS89Jvz7kCeUyuWWDXLTiNRkAzfx3EuXq4KSSkH62W',
        to: '2HxX36oXZS89Jvz7kCeUyuWWDXLTiNRkAzfx3EuXq4KSSkH62W',
        timestamp: 1279407412740,
        txnValue: 1.23,
      },
      {
        id: 5,
        transactionHash: '111111113903740370',
        from: '2HxX36oXZS89Jvz7kCeUyuWWDXLTiNRkAzfx3EuXq4KSSkH62W',
        to: '2HxX36oXZS89Jvz7kCeUyuWWDXLTiNRkAzfx3EuXq4KSSkH62W',
        timestamp: 1279407412740,
        txnValue: 1.23,
      },
      {
        id: 6,
        transactionHash: '111111113903740370',
        from: '2HxX36oXZS89Jvz7kCeUyuWWDXLTiNRkAzfx3EuXq4KSSkH62W',
        to: '2HxX36oXZS89Jvz7kCeUyuWWDXLTiNRkAzfx3EuXq4KSSkH62W',
        timestamp: 1279407412740,
        txnValue: 1.23,
      },
      {
        id: 7,
        transactionHash: '111111113903740370',
        from: '2HxX36oXZS89Jvz7kCeUyuWWDXLTiNRkAzfx3EuXq4KSSkH62W',
        to: '2HxX36oXZS89Jvz7kCeUyuWWDXLTiNRkAzfx3EuXq4KSSkH62W',
        timestamp: 1279407412740,
        txnValue: 1.23,
      },
    ];
    return (
      <div className={clsx('latest-all', isMobile && 'latest-all-mobile')}>
        <Latest iconType="latest-block" isBlocks={true} data={blocks} isMobile={isMobile}></Latest>
        <Latest iconType="latest-tx" isBlocks={false} data={transactions} isMobile={isMobile}></Latest>
      </div>
    );
  };

  const Chart = () => {
    const data = tpsData;
    return <TPSChart isMobile={isMobile} data={data}></TPSChart>;
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
        <div className="search-section">
          <SearchComp isMobile={isMobile} />
        </div>
      </div>
      <OverView></OverView>
      <LatestAll></LatestAll>
      <Chart></Chart>
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
