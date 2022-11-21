import config, { CHAIN_ID } from 'constants/config/config';

const contracts = [
  {
    chainId: CHAIN_ID,
    contractAddress: config.genesisContract,
    contractName: 'Genesis',
    description: 'contract Genesis',
    github: '',
  },
  {
    chainId: CHAIN_ID,
    contractAddress: config.multiToken,
    contractName: 'Token',
    description: 'contract Token',
    github: '',
  },
  {
    chainId: CHAIN_ID,
    contractAddress: config.dividends,
    contractName: 'Dividend',
    description: 'contract Dividend',
    github: '',
  },
  {
    chainId: CHAIN_ID,
    contractAddress: config.consensusDPoS,
    contractName: 'Consensus.Dpos',
    description: 'contract Consensus',
    github: '',
  },
  {
    chainId: CHAIN_ID,
    contractAddress: config.tokenConverter,
    contractName: 'Token Converter',
    description: 'contract Token Converter',
    github: '',
  },
  {
    chainId: CHAIN_ID,
    contractAddress: config.electionContractAddr,
    contractName: 'Election',
    description: 'contract Election',
    github: '',
  },
  {
    chainId: CHAIN_ID,
    contractAddress: config.profitContractAddr,
    contractName: 'Profit',
    description: 'contract Profit',
    github: '',
  },
  {
    chainId: CHAIN_ID,
    description: 'contract Parliament',
    contractAddress: config.parliamentContract,
    contractName: 'Parliament',
    github: '',
  },
  {
    chainId: CHAIN_ID,
    description: 'contract Association',
    contractAddress: config.associationContract,
    contractName: 'Association',
    github: '',
  },
  {
    chainId: CHAIN_ID,
    description: 'contract Referendum',
    contractAddress: config.referendumContract,
    contractName: 'Referendum',
    github: '',
  },
  {
    chainId: CHAIN_ID,
    description: 'contract CrossChain',
    contractAddress: config.crossChainContract,
    contractName: 'CrossChain',
    github: '',
  },
];

export default contracts;
