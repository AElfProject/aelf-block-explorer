export interface ILogsProps {
  address: string;
  name: string;
  indexed: never[];
  timestamp?: string;
  nonIndexed: string;
  decode: string; //decode json
}
