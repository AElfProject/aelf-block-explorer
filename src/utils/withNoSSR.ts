import dynamic from 'next/dynamic';
const withNoSSR = (Component: any) => dynamic(() => Promise.resolve(Component), { ssr: false });
export default withNoSSR;
