import { gql } from '@apollo/client';

export type InscriptionQueryVariables = {
  input: {
    chainId: string;
    tick: string | null;
    beginBlockHeight?: number;
    endBlockHeight?: number;
  };
};

type ExternalInfoDto = {
  key: string;
  value: string;
};

export type InscriptionQuery = {
  tick: string;
  totalSupply: number;
  issuer: string;
  issueChainId: number;
  collectionExternalInfo: Array<ExternalInfoDto>;
  itemExternalInfo: Array<ExternalInfoDto>;
  owner: string;
  limit: number;
  deployer: string;
  transactionId: string;
};

export const InscriptionDocument = gql`
  query inscription($input: GetInscriptionInput) {
    inscription(input: $input) {
      tick
      totalSupply
      issuer
      issueChainId
      collectionExternalInfo {
        key
        value
      }
      itemExternalInfo {
        key
        value
      }
      owner
      limit
      deployer
      transactionId
    }
  }
`;
