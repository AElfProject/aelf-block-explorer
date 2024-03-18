import { gql } from '@apollo/client';

export type InscriptionTransferQueryVariables = {
  input: {
    chainId: string;
    sorting?: string;
    skipCount: number;
    maxResultCount: number;
  };
};

export type InscriptionTransferQuery = {
  transactionId: string;
  method: string;
  fromAddress: string;
  toAddress: string;
  inscriptionInfo: string;
  tick: string;
  amt: number;
  number: number;
  id: string;
  chainId: string;
  blockHash: string;
  blockHeight: number;
  blockTime: string;
  inscriptionImage: string;
};

export type InscriptionTransferQueryRes = {
  data: {
    inscriptionTransfer: InscriptionTransferQuery[];
  };
};

export const InscriptionTransferDocument = gql`
  query inscriptionTransfer($input: GetInscriptionTransferInput) {
    inscriptionTransfer(input: $input) {
      transactionId
      method
      fromAddress
      toAddress
      inscriptionInfo
      tick
      amt
      number
      id
      chainId
      blockHash
      blockHeight
      blockTime
      inscriptionImage
    }
  }
`;
