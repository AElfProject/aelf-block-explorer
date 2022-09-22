import type { AppProps } from 'next/app';
require('../styles/globals.less');
require('../styles/common.less');
require('../styles/antd.less');
import HeaderBlank from 'components/PageHead/HeaderBlank';
import BrowserFooter from 'components/Footer/Footer';
import BrowserBreadcrumb from 'components/Breadcrumb/Breadcrumb';
import Container from 'components/Container/Container';
import PageHead from 'components/PageHead/Header';
import ProposalApp from './_proposalApp';
import dynamic from 'next/dynamic';
import { store } from '../redux/store';
import { Provider as ReduxProvider } from 'react-redux';
import initAxios from '../utils/axios';
import { useRouter } from 'next/router';
const Provider = dynamic(import('hooks/Providers/ProviderBasic'), { ssr: false });
import Cookies from 'js-cookie';
import { get } from 'utils/axios';
import config from 'constants/config/config';
initAxios();

const ROUTES_DEFAULT: any = {
  apply: '/proposal/proposals',
  myProposals: '/proposal/proposals',
  createOrganizations: '/proposal/organizations',
};

const PROPOSAL_URL = ['proposals', 'proposalsDetail', 'organizations', 'createOrganizations', 'apply', 'myProposals'];
async function getNodesInfo() {
  const nodesInfoProvider = '/nodes/info';
  const nodesInfo = await get(nodesInfoProvider);

  if (nodesInfo && nodesInfo.list) {
    const nodesInfoList = nodesInfo.list;
    localStorage.setItem('nodesInfo', JSON.stringify(nodesInfoList));

    // todo: MAIN_CHAIN_ID CHAIN_ID
    const nodeInfo = nodesInfoList.find((item) => {
      if (item.chain_id === config.CHAIN_ID) {
        return item;
      }
    });
    const { contract_address, chain_id } = nodeInfo;
    localStorage.setItem('currentChain', JSON.stringify(nodeInfo));
    Cookies.set('aelf_ca_ci', contract_address + chain_id);
  }
  // TODO: turn to 404 page.
}

getNodesInfo();
const APP = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const pathKey = router.asPath.split('/')[2];
  const flag = router.asPath.split('/')[1] === 'proposal' && PROPOSAL_URL.includes(pathKey);
  pageProps.default = ROUTES_DEFAULT[pathKey];
  return (
    <ReduxProvider store={store}>
      <PageHead />
      <Provider>
        <HeaderBlank />
        <BrowserBreadcrumb />
        <Container>
          {flag ? <ProposalApp {...pageProps} Component={Component}></ProposalApp> : <Component {...pageProps} />}
        </Container>
        <BrowserFooter />
      </Provider>
    </ReduxProvider>
  );
};

export default dynamic(() => Promise.resolve(APP), {
  ssr: false,
});
