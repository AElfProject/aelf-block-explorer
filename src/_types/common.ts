enum TAddressType {
  walletAddress,
  contractAddress,
}

export enum TTransactionStatus {
  Success = 'Success',
  fail = 'Fail',
}

export interface IToken {
  name: string;
  symbol: string;
  imageUrl: string;
  decimals: number;
}

export interface IAddress {
  name: string;
  address: string;
  addressType: TAddressType;
  isManager: false;
  isProducer: true;
}

export enum AddressType {
  address,
  Contract,
}

export enum SortEnum {
  asc = 'Asc',
  desc = 'Desc',
}
