import { NextComponentType, NextPageContext } from 'next';
import HeaderBlank from 'components/PageHead/HeaderBlank';
import BrowserFooter from 'components/Footer/Footer';
import BrowserBreadcrumb from 'components/Breadcrumb/Breadcrumb';
import Container from 'components/Container/Container';
import PageHead from 'components/PageHead/Header';
import ProposalApp from './_proposalApp';
import { store } from '../redux/store';
import { Provider as ReduxProvider } from 'react-redux';
import initAxios from '../utils/axios';
import { useRouter } from 'next/router';
import Provider from 'hooks/Providers/ProviderBasic';
import Cookies from 'js-cookie';
import { get, getSSR } from 'utils/axios';
import config, { getConfig } from 'constants/config/config';
import { getCMSDelayRequestSSR } from 'utils/getCMS';
import CHAIN_STATE from 'constants/config/configCMS.json';
import { createContext } from 'react';
require('../styles/globals.less');
require('../styles/common.less');
require('../styles/antd.less');
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
let chainConfig = config;
export const AppContext: any = createContext({});
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
      if (item.chain_id === chainConfig.CHAIN_ID) {
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
    if (item.chain_id === chainConfig.CHAIN_ID) {
      return item;
    }
  })!;
  return nodeInfo;
}

async function fetchChainList(ctx: NextPageContext) {
  const data = await getCMSDelayRequestSSR(0);
  if (data && data.chainItem && data.updated_at !== CHAIN_STATE.updated_at) {
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
      <AppContext.Provider value={pageProps.chainconfig}>
        <Provider>
          <PageHead {...pageProps} />
          <HeaderBlank />
          <BrowserBreadcrumb />
          <Container>
            {flag ? <ProposalApp {...pageProps} Component={Component}></ProposalApp> : <Component {...pageProps} />}
          </Container>
          <BrowserFooter />
        </Provider>
      </AppContext.Provider>
    </ReduxProvider>
  );
};
APP.getInitialProps = async ({ ctx }: { ctx: NextPageContext }) => {
  let nodeInfo, chainList;
  const headers = ctx.req?.headers;
  initAxios();
  if (typeof window === 'undefined') {
    chainConfig = getConfig(headers);
    // console.log(chainConfig, 'chainConfig');
    nodeInfo = await getNodesInfoSSR(ctx);
    chainList = await fetchChainList(ctx);
  } else {
    getNodesInfo();
  }
  return {
    pageProps: {
      chainconfig: chainConfig,
      nodeinfo: nodeInfo,
      headers,
      chainlist: chainList,
    },
  };
};
export default APP;
