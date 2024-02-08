import { graphQLClientProvider } from './client';

import { InscriptionQueryVariables, InscriptionQuery, InscriptionDocument } from './types/inscription';

import {
  InscriptionTransferQueryVariables,
  InscriptionTransferQuery,
  InscriptionTransferDocument,
} from './types/inscriptionTransfer';

// Inscription detail
const getInscriptionDetailByAELF = async (params: InscriptionQueryVariables) => {
  const apolloClient = graphQLClientProvider();
  const result = await apolloClient.query<InscriptionQuery>({
    query: InscriptionDocument,
    variables: params,
  });
  return result;
};

// Inscription latest
const getInscriptionLatest = async (params: InscriptionTransferQueryVariables) => {
  const apolloClient = graphQLClientProvider();
  const result = await apolloClient.query<InscriptionTransferQuery>({
    query: InscriptionTransferDocument,
    variables: params,
  });
  return result;
};

export { getInscriptionDetailByAELF, getInscriptionLatest };
