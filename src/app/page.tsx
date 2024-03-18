/*
 * @Author: aelf-lxy
 * @Date: 2023-07-31 14:37:10
 * @LastEditors: aelf-lxy
 * @LastEditTime: 2023-08-09 19:52:47
 * @Description: home page
 */
import request from '@_api';
import { Socket_API_List } from '@_api/list';
import { isMobileOnServer } from '@_utils/isMobile';
import { headers } from 'next/headers';
import Home from '../pageComponents/home/page';
import { IOverviewSSR } from '../pageComponents/home/type';
import { HubConnectionBuilder, HttpTransportType } from '@microsoft/signalr';

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
const initOverview = async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return {
    tokenPriceInUsd: 2,
    tokenPricePercent: '2',
    transactions: '2',
    tps: '2',
    reward: '5',
    blockHeight: 6,
    accounts: 7,
    citizenWelfare: '8',
  };
};

export default async function HomePage() {
  const headersList = headers();
  const overview = (await initOverview()) as IOverviewSSR;
  return <Home overviewSSR={overview}></Home>;
}
