// export interface IActivityTableData {
//   transactionHash: string;
//   status: string;
//   action: string;
//   timestamp: string;
//   price: string;
//   amount: string;
//   from: string;
//   to: string;
// }
interface Collection {
  name: string;
  imageUrl: string;
  symbol: string;
}

interface MarketPlace {
  marketName: string;
  marketLogo: string;
  marketUrl: string;
}

interface Address {
  name: string;
  address: string;
  addressType: number;
  isManager: boolean;
  isProducer: boolean;
}

interface PropertyItem {
  title: string;
  value: string;
}

export interface IActivityTableData {
  transactionHash: string;
  action: string;
  timestamp: string;
  price: number;
  amount: number;
  from: Address;
  to: Address;
  marketPlaces: MarketPlace;
}

export interface HolderItem {
  rank: number;
  address: Address;
  quantity: number;
  percentage: number;
}
export interface ItemSymbolDetailActivity {
  total: number;
  list: IActivityTableData[];
}
export interface ItemSymbolDetailHolders {
  total: number;
  list: HolderItem[];
}
export interface ItemSymbolDetailOverview {
  nftCollection: Collection;
  item: Collection;
  holders: number;
  owner: string[];
  issuer: string[];
  tokenSymbol: string;
  quantity: number;
  marketPlaces: MarketPlace;
  isSeed: boolean;
  symbolToCreate: string;
  expires: string;
  properties: {
    total: number;
    list: PropertyItem[];
  };
  description: string;
  // activity: ;
  // holders: ;
}
