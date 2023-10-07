export interface IPrice {
  [key: string]: number;
}
export interface IExplorerItem {
  title: string;
  url: string;
  netWorkType: string;
}
export interface INetworkItem {
  id: number;
  chainId: string;
  chainsLinkName: string;
  chainsLink: string;
}
export interface IMenuItem {
  id: number;
  label: string;
  link: string;
  children: IMenuItem[];
}
