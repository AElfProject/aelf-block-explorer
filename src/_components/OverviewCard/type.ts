export interface IOverviewItem {
  key: string;
  label: string;
  tooltip?: string;
  format?: (value: any) => any;
  render?: (text: any, record: any, index: number) => React.ReactNode;
}

export interface IOverviewCardProps {
  items: IOverviewItem[];
  dataSource: object;
  breakIndex?: number; // start at 0
}
