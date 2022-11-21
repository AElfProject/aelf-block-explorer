/// <reference types="react-scripts" />
interface Window {
  NightElf?: any;
  editor?: editor.IStandaloneCodeEditor | undefined;
}
// 声明没有ts文件的第三方SDK
declare module 'aelf-sdk';

// 不引入TS报错
declare module '*.less';
declare module '*.module.less';
declare module './styles.module.less';

declare module '*.json';
declare module '*.css';

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.gif';
declare module '*.ico';

declare module 'socket.io-client';
declare module 'react-if';

declare module 'firebase/app';
declare module 'firebase/analytics';
