import { NextComponentType, NextPageContext } from 'next';
import dynamic from 'next/dynamic';
const HeaderBlank = dynamic(() => import('components/PageHead/HeaderBlank'));
const BrowserFooter = dynamic(() => import('components/Footer/Footer'));
const BrowserBreadcrumb = dynamic(() => import('components/Breadcrumb/Breadcrumb'));
const Container = dynamic(() => import('components/Container/Container'));
const PageHead = dynamic(() => import('components/PageHead/Header'));
const ProposalApp = dynamic(() => import('./_proposalApp'), { ssr: false });
import { store } from '../redux/store';
import { Provider as ReduxProvider } from 'react-redux';
import initAxios from '../utils/axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { get, getSSR } from 'utils/axios';
import config, { NETWORK_TYPE } from 'constants/config/config';
import { getCMSDelayRequestSSR } from 'utils/getCMS';
import Head from 'next/head';
import ProviderBasic from 'hooks/Providers/ProviderBasic';
import { uploadPerformance } from 'utils/firebase-config';
// as style is broken on build but works on dev env with next-plugin-antd-less
// need require antd less dc
require('antd/dist/antd.variable.less');
require('../styles/globals.less');
require('../styles/common.less');
require('../styles/antd.less');
require('../styles/custom.less');

type AppProps = {
  pageProps: any;
  Component: NextComponentType<NextPageContext, any, any> & { layoutProps: any };
};
interface NodesInfoItem {
  api_domain: string;
  api_ip: string;
  chain_id: string;
  contract_address: string;
  create_time: string;
  id: number;
  owner: string;
  rpc_domain: string;
  rpc_ip: string;
  status: number;
  token_name: string;
}
interface NodesInfoDto {
  list: NodesInfoItem[];
}
interface RouteDefaultDto {
  [key: string]: string;
}
const ROUTES_DEFAULT: RouteDefaultDto = {
  apply: '/proposal/proposals',
  myProposals: '/proposal/proposals',
  createOrganizations: '/proposal/organizations',
};
const PROPOSAL_URL = ['proposals', 'proposalsDetail', 'organizations', 'createOrganizations', 'apply', 'myProposals'];
const nodesInfoProvider = '/nodes/info';
async function getNodesInfo() {
  const nodesInfo = (await get(nodesInfoProvider)) as NodesInfoDto;
  if (nodesInfo && nodesInfo.list) {
    const nodesInfoList = nodesInfo.list;
    localStorage.setItem('nodesInfo', JSON.stringify(nodesInfoList));
    const nodeInfo: NodesInfoItem = nodesInfoList.find((item) => {
      if (item.chain_id === config.CHAIN_ID) {
        return item;
      }
    })!;
    const { contract_address, chain_id } = nodeInfo;
    localStorage.setItem('currentChain', JSON.stringify(nodeInfo));
    Cookies.set('aelf_ca_ci', contract_address + chain_id);
  }
}
async function getNodesInfoSSR(ctx: NextPageContext) {
  const nodesInfo = (await getSSR(ctx, nodesInfoProvider)) as NodesInfoDto;
  const nodesInfoList = nodesInfo?.list;
  const nodeInfo: NodesInfoItem = nodesInfoList.find((item) => {
    if (item.chain_id === config.CHAIN_ID) {
      return item;
    }
  })!;
  return nodeInfo;
}

async function fetchChainList(ctx: NextPageContext) {
  const data = await getCMSDelayRequestSSR(0);
  if (data && data.chainItem) {
    return data.chainItem;
  }
}
const APP = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const pathKey = router.asPath.split('/')[2];
  const flag = router.asPath.split('/')[1] === 'proposal' && PROPOSAL_URL.includes(pathKey);
  pageProps.default = ROUTES_DEFAULT[pathKey];

  return (
    <ReduxProvider store={store}>
      <Head>
        <title>AELF Block Explorer</title>
        {/* favicon is different in test and main */}
        {NETWORK_TYPE === 'MAIN' ? (
          <link rel="shortcut icon" href="/favicon_main.ico" />
        ) : (
          <link rel="shortcut icon" href="/favicon_test.ico" />
        )}
        <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=5"></meta>
        <meta
          name="description"
          content="aelf explorer enables users to keep track of all the on-chain activities on aelf network, including real-time block data, transaction history, addresses, proposals, election results, etc."></meta>
      </Head>
      <ProviderBasic>
        <PageHead {...pageProps} />
        <HeaderBlank />
        <BrowserBreadcrumb />
        <Container>
          {flag ? <ProposalApp {...pageProps} Component={Component}></ProposalApp> : <Component {...pageProps} />}
        </Container>
        <BrowserFooter {...pageProps} />
      </ProviderBasic>
    </ReduxProvider>
  );
};
APP.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  const time = new Date().getTime();
  let nodeInfo, chainList;
  const headers = ctx.req?.headers;
  initAxios();
  if (typeof window === 'undefined') {
    nodeInfo = await getNodesInfoSSR(ctx);
    // chainList = await fetchChainList(ctx);
  } else {
    getNodesInfo();
    uploadPerformance();
  }
  return {
    pageProps: {
      nodeinfo: nodeInfo,
      headers,
      chainlist: chainList,
    },
  };
};
export default APP;
