// export { default } from 'page-components/Home';
// const Home = dynamic(() => import('page-components/Home'), { ssr: false });
import withNoSSR from 'utils/withNoSSR';
import Home from 'page-components/Home';
// export default withNoSSR(Home);
export default Home;
