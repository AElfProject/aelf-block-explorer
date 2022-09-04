import type { AppProps } from 'next/app';
import '../styles/globals.less';
import '../styles/common.less';
import '../styles/antd.less';
import Header from 'components/Header';
import dynamic from 'next/dynamic';
import PageHead from 'components/PageHead';
import Footer from '../components/Footer';
import initAxios from '../utils/axios';
const Provider = dynamic(import('hooks/Providers/ProviderBasic'), { ssr: false });
// import '../utils/vconsole';
initAxios();
export default function APP({ Component, pageProps }: AppProps) {
  return (
    <>
      <PageHead title={'Next Demo'} />
      <Provider>
        <Header />
        <div className="page-component">
          <div className="bg-body">
            <Component {...pageProps} />
          </div>
        </div>
      </Provider>
      <Footer />
    </>
  );
}
