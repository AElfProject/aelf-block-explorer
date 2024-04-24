export interface ILogsProps {
  address: string;
  eventName: string;
  contractInfo: {
    name: string;
    address: string;
    addressType: number;
    isManager: boolean;
    isProducer: boolean;
  };
  indexed: never[];
  nonIndexed: string;
}
