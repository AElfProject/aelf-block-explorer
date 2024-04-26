import { TChainID } from '@_api/type';

type HashParams = {
  hash: string;
  chain: TChainID;
};

type ChainId = {
  chain: string;
};

type TokenSymbol = {
  tokenSymbol: string;
};

type CollectionSymbol = {
  collectionSymbol: string;
};

type ItemSymbol = {
  itemSymbol: string;
};

type NftCollectionPageParams = ChainId & CollectionSymbol;
type Chain = 'AELF' | 'tDVV' | 'tDVW';
