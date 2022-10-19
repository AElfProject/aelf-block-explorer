import BlockDetail from 'page-components/BlockDetail/BlockDetail';
import { NextPageContext } from 'next';
import { BLOCK_INFO_API_URL } from 'constants/api';
import { getSSR, aelf } from 'utils/axios';
import { getContractNames } from 'utils/utils';
import { Itx, IRes } from 'page-components/BlockDetail/types';
let bestChainHeightSSR, blockHeightSSR, txsListSSR, blockInfoSSR;
let redirectRes: string;
let retryBlockInfoCount = 0;
const retryBlockInfoLimit = 2;
const getChainStatus = async () => {
  return aelf.chain
    .getChainStatus()
    .then((result) => {
      return result;
    })
    .catch((_) => {
      return {};
    });
};
const merge = (data = [], contractNames) => {
  return (data || []).map((item: Itx) => ({
    ...item,
    contractName: contractNames[item.address_to],
  }));
};
const getTxsList = async (ctx, blockHash) => {
  const getTxsOption = {
    limit: 1000,
    page: 0,
    order: 'asc',
    block_hash: blockHash,
  };

  let data = await getSSR(ctx, '/block/transactions', getTxsOption).catch((error) => {
    console.log('>>>>error', error);
    redirectRes = '/search-failed';
  });
  const contractNames = await getContractNames().catch((error) => {
    console.log('>>>>error', error);
    redirectRes = '/search-failed';
  });
  data = {
    ...data,
    transactions: merge(data.transactions || [], contractNames),
  };
  return data;
};
const getDataFromHeight = async (ctx, blockHeight) => {
  try {
    const result =
      (await aelf.chain.getBlockByHeight(blockHeight, false).catch((error) => {
        redirectRes = '/search-failed';
      })) || {};
    const { BlockHash: blockHash } = result;
    const { transactions = [] } = blockHash
      ? await getTxsList(ctx, blockHash).catch((error) => {
          redirectRes = '/search-failed';
        })
      : {};
    return { blockInfo: result, transactionList: transactions };
  } catch (err) {
    console.error('err', err);
    return { blockInfo: undefined, transactionList: undefined };
  }
};
const getDataFromHash = async (ctx, blockHash) => {
  const txsList = await getTxsList(ctx, blockHash);
  const { transactions = [] } = txsList;
  if (!transactions[0]) {
    redirectRes = '/search-invalid/' + blockHash;
  }
  const { block_height: blockHeight } = transactions[0];
  const result = await aelf.chain.getBlockByHeight(blockHeight, false).catch((error) => {
    redirectRes = '/search-failed';
  });
  return { blockInfo: result, transactionList: transactions };
};
const fetchBlockInfo = async (ctx, id) => {
  if (!id) return;
  const chainStatus = await getChainStatus();
  const { BestChainHeight, LastIrreversibleBlockHeight = 0 } = chainStatus;
  bestChainHeightSSR = LastIrreversibleBlockHeight;
  let result;
  let blockHeight;
  let txsList = [];
  if (parseInt(id, 10) == id) {
    blockHeight = id;
    if (blockHeight > BestChainHeight) {
      redirectRes = '/search-invalid/' + blockHeight;
      return;
    } else {
      const data = await getDataFromHeight(ctx, id);
      result = data.blockInfo;
      txsList = data.transactionList;
    }
  } else {
    const data = await getDataFromHash(ctx, id);
    result = data.blockInfo;
    txsList = data.transactionList;
    blockHeight = result.Header.Height;
  }
  blockHeightSSR = blockHeight;
  txsListSSR = txsList;
  await getSSR(ctx, BLOCK_INFO_API_URL, {
    height: blockHeight,
  })
    .then((res: IRes = { miner: '', dividends: '' }) => {
      if (result) {
        const { Header: header } = result;
        blockInfoSSR = {
          basicInfo: {
            blockHeight: blockHeight,
            timestamp: header.Time,
            blockHash: result.BlockHash,
            transactions: txsList.length,
            chainId: header.ChainId,
            miner: res.miner,
            reward: res.dividends,
            previousBlockHash: header.PreviousBlockHash,
          },
          extensionInfo: {
            blockSize: result.BlockSize,
            merkleTreeRootOfTransactions: header.MerkleTreeRootOfTransactions,
            merkleTreeRootOfWorldState: header.MerkleTreeRootOfWorldState,
            merkleTreeRootOfTransactionState: header.MerkleTreeRootOfTransactionState,
            extra: header.Extra,
            bloom: header.Bloom,
            signerPubkey: header.SignerPubkey,
          },
        };
      } else {
        redirectRes = '/search-invalid/' + id;
      }
    })
    .catch((_) => {
      redirectRes = '/search-failed';
    });
  // if block is new and cannot txsList is null
  if ((!txsList || !txsList.length) && blockHeight <= BestChainHeight + 6) {
    if (retryBlockInfoCount >= retryBlockInfoLimit) {
      return;
    }
    retryBlockInfoCount++;
    setTimeout(() => {
      fetchBlockInfo(ctx, id);
    }, 0);
  }
};
export const getServerSideProps = async (ctx: NextPageContext) => {
  const headers = ctx.req?.headers;
  const { id, tab } = ctx.query;
  const activeKey = tab === 'txns' ? 'transactions' : 'overview';
  await fetchBlockInfo(ctx, id);
  // console.log(id, activeKey);
  // console.log(bestChainHeightSSR, 'bestChainHeightSSR');
  // console.log(blockHeightSSR, 'blockHeightSSR');
  // console.log(txsListSSR, 'txsListSSR');
  // console.log(blockInfoSSR, 'blockInfoSSR');
  if (redirectRes) {
    return {
      redirect: {
        permanent: false,
        destination: redirectRes,
      },
    };
  }
  // without JSON.parse and JSON.stringify
  // throw error that `SerializableError: Error serializing`
  return {
    props: {
      pageidssr: id,
      activekeyssr: activeKey,
      bestchainheightssr: bestChainHeightSSR,
      blockheightssr: blockHeightSSR,
      txslistssr: JSON.parse(JSON.stringify(txsListSSR)),
      blockinfossr: blockInfoSSR,
      headers,
    },
  };
};
export default BlockDetail;
