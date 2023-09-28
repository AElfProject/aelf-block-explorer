import { ILogsProps } from '@_components/LogsContainer/type';
export interface IEvents {
  logs: ILogsProps;
  id: number;
  txnHash: string;
  address: string;
  blockHeight: number;
  method: string;
}
