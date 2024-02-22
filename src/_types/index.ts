export interface IPrice {
  [key: string]: number;
}
export interface IExplorerItem {
  title: string;
  url: string;
  netWorkType: string;
}
export interface NetworkItem {
  key: string;
  label: string;
  path: string;
}
export interface ChainItem {
  label: string;
  key: string;
}
export interface MenuItem {
  id: number;
  label: string;
  path: string;
  children: MenuItem[];
}
