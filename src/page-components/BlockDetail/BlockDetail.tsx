import { Tag, Tabs, Button } from 'antd';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import IconFont from 'components/IconFont';
import { BLOCK_INFO_API_URL } from 'constants/api';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';
import { getContractNames } from 'utils/utils';
import { get, aelf } from 'utils/axios';
import BasicInfo from './components/BasicInfo';
import ExtensionInfo from './components/ExtensionInfo';
import TransactionList from './components/TransactionList';
import Link from 'next/link';
import { useDebounce, useUpdateEffect } from 'react-use';
import CustomSkeleton from 'components/CustomSkeleton/CustomSkeleton';
import { withRouter } from 'next/router';
import { IProps, IRes, ITransactions, Itx } from './types';
require('./BlockDetail.styles.less');
const { TabPane } = Tabs;

function BlockDetail(props: IProps) {
  const [pageId, setPageId] = useState(props.pageidssr);
  const [blockHeight, setBlockHeight] = useState(props.blockheightssr);
  const [blockInfo, setBlockInfo] = useState(props.blockinfossr);
  const [transactionList, setTransactionList] = useState(props.txslistssr || []);
  const [retryBlockInfoCount, setRetryBlockInfoCount] = useState(0);
  const [bestChainHeight, setBestChainHeight] = useState(props.bestchainheightssr);
  const [showExtensionInfo, setShowExtensionInfo] = useState(false);
  const [activeKey, setActiveKey] = useState(props.activekeyssr || 'overview');
  const [isMobile, setIsMobile] = useState(!!isPhoneCheckSSR(props.headers));

  useEffect(() => {
    setIsMobile(!!isPhoneCheck());
  }, []);
  const retryBlockInfoLimit = 2;

  const jumpLink = useMemo(() => {
    const prevLink = `/block/${+blockHeight - 1}`;
    const nextLink = `/block/${+blockHeight + 1}`;

    return (
      <span className="jump-link">
        <a onClick={() => +blockHeight === 1 || props.router.push(prevLink)}>
          <IconFont type="left" />
        </a>
        <Link href={nextLink}>
          <a>
            <IconFont style={{ transform: 'rotate(180deg)' }} type="left" />
          </a>
        </Link>
      </span>
    );
  }, [blockHeight]);

  useUpdateEffect(() => {
    const { query } = props.router;
    const { id } = query;
    if (id !== pageId) {
      setPageId(id);
      setBlockInfo(undefined);
      setShowExtensionInfo(false);
    }
    if (location.search?.includes('tab=txns')) {
      setActiveKey('transactions');
    } else {
      setActiveKey('overview');
    }
  }, [props]);

  useUpdateEffect(() => {
    try {
      fetchBlockInfo();
    } catch (error) {
      console.log('>>>error', error);
    }
  }, [pageId]);

  const merge = useCallback((data: Itx[] | never[] = [], contractNames) => {
    return (data || []).map((item: Itx) => ({
      ...item,
      contractName: contractNames[item.address_to],
    }));
  }, []);

  const getChainStatus = useCallback(() => {
    return aelf.chain
      .getChainStatus()
      .then((result) => {
        return result;
      })
      .catch((_) => {
        location.href = '/search-failed';
      });
  }, [aelf]);

  const getTxsList: (blockHash: string, page?: number) => Promise<ITransactions> = useCallback(
    async (blockHash, page?) => {
      const getTxsOption = {
        limit: 1000,
        page: page || 0,
        order: 'asc',
        block_hash: blockHash,
      };

      let data: ITransactions = (await get('/block/transactions', getTxsOption).catch((error) => {
        console.log('>>>>error', error);
        location.href = '/search-failed';
      })) as ITransactions;
      const contractNames = await getContractNames().catch((error) => {
        console.log('>>>>error', error);
        location.href = '/search-failed';
      });
      data = {
        ...data,
        transactions: merge(data.transactions || [], contractNames),
      };
      return data;
    },
    [get, getContractNames, merge],
  );

  const getDataFromHeight = useCallback(
    async (blockHeight) => {
      try {
        const result = await aelf.chain.getBlockByHeight(blockHeight, false).catch((error) => {
          location.href = '/search-failed';
        });
        const { BlockHash: blockHash } = result;
        const { transactions = [] } = blockHash
          ? ((await getTxsList(blockHash).catch((error) => {
              location.href = '/search-failed';
            })) as ITransactions)
          : {};
        return { blockInfo: result, transactionList: transactions };
      } catch (err) {
        console.error('err', err);
        return { blockInfo: undefined, transactionList: undefined };
      }
    },
    [aelf, getTxsList],
  );

  const getDataFromHash = useCallback(
    async (blockHash) => {
      const { query } = props.router;
      const { id } = query;
      const txsList = await getTxsList(blockHash);
      const { transactions = [] } = txsList;
      if (!transactions[0]) {
        location.href = '/search-invalid/' + id;
      }
      const { block_height: blockHeight } = transactions[0];
      const result = await aelf.chain.getBlockByHeight(blockHeight, false).catch((error) => {
        location.href = '/search-failed';
      });
      return { blockInfo: result, transactionList: transactions };
    },
    [aelf, getTxsList],
  );

  const fetchBlockInfo = useCallback(async () => {
    if (!pageId) return;
    const input = pageId;
    const chainStatus = await getChainStatus();
    const { BestChainHeight, LastIrreversibleBlockHeight = 0 } = chainStatus;
    setBestChainHeight(LastIrreversibleBlockHeight);

    let result;
    let blockHeight;
    let txsList: Itx[] = [];
    if (parseInt('' + input, 10) == input) {
      blockHeight = input;
      if (blockHeight > BestChainHeight) {
        location.href = '/search-invalid/' + blockHeight;
      } else {
        const data = await getDataFromHeight(input);
        result = data.blockInfo;
        txsList = data.transactionList!;
      }
    } else {
      const data = await getDataFromHash(input);
      result = data.blockInfo;
      txsList = data.transactionList!;
      blockHeight = result.Header.Height;
    }
    setBlockHeight(blockHeight);
    setTransactionList(txsList);

    get(BLOCK_INFO_API_URL, {
      height: blockHeight,
    })
      .then((res: IRes = { miner: '', dividends: '' }) => {
        if (result) {
          const { Header: header } = result;
          setBlockInfo({
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
          });
        } else {
          location.href = '/search-invalid/' + pageId;
        }
      })
      .catch((_) => {
        location.href = '/search-failed';
      });
    // if block is new and cannot txsList is null
    if ((!txsList || !txsList.length) && blockHeight <= BestChainHeight + 6) {
      if (retryBlockInfoCount >= retryBlockInfoLimit) {
        return;
      }
      setRetryBlockInfoCount(retryBlockInfoCount + 1);
      setTimeout(() => {
        fetchBlockInfo();
      }, 1000);
    }
  }, [pageId]);

  return (
    <div className={`block-detail-container basic-container-new ${isMobile && 'mobile'}`}>
      <h2>
        Block
        {blockHeight && <Tag className="block-height">#{blockHeight}</Tag>}
        {blockHeight && jumpLink}
      </h2>
      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
        <TabPane tab="Overview" key="overview">
          <div className="overview-container">
            <CustomSkeleton loading={!blockInfo}>
              {blockInfo && (
                <>
                  <BasicInfo basicInfo={blockInfo.basicInfo} bestChainHeight={bestChainHeight} />
                  {showExtensionInfo && <ExtensionInfo extensionInfo={blockInfo.extensionInfo} />}
                  <Button
                    className={`show-more-btn ${showExtensionInfo ? 'more' : 'less'}`}
                    type="link"
                    onClick={() => setShowExtensionInfo(!showExtensionInfo)}>
                    Click to see {!showExtensionInfo ? 'More' : 'Less'}
                    <IconFont type="shouqijiantou" />
                  </Button>
                </>
              )}
            </CustomSkeleton>
          </div>
        </TabPane>
        <TabPane tab="Transactions" key="transactions">
          <div className="transactions-container">
            <TransactionList allData={transactionList} headers={props.headers} price={props.pricessr} />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default withRouter(BlockDetail);
