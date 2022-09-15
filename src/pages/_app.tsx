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
import NoSSR from 'react-no-ssr';
import { useRouter } from 'next/router';
const Provider = dynamic(import('hooks/Providers/ProviderBasic'), { ssr: false });
// import '../utils/vconsole';
initAxios();

function SafeHydrate({ children }) {
  return <div suppressHydrationWarning={true}>{typeof window === 'undefined' ? null : children}</div>;
}
const PROPOSAL_URL = ['proposals', 'proposalDetails', 'organizations', 'createOrganizations', 'apply', 'myProposals'];
const APP = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();
  const pathKey = router.asPath.split('/')[2];
  const flag = PROPOSAL_URL.includes(pathKey);
  // debugger;
  return (
    // <SafeHydrate>
    // <NoSSR>
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
    // </NoSSR>
    // </SafeHydrate>
  );
};

export default dynamic(() => Promise.resolve(APP), {
  ssr: false,
});
