type HashParams = {
  hash: string;
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