import { message, Tag, Tabs, Button } from "antd";
import React, { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import IconFont from "../../components/IconFont";
import { BLOCK_INFO_API_URL } from "../../constants";
import useMobile from "../../hooks/useMobile";
import { aelf, get, getContractNames } from "../../utils";
import BasicInfo from "./components/BasicInfo";

const { TabPane } = Tabs;

import "./BlockDetail.styles.less";
import ExtensionInfo from "./components/ExtensionInfo";
import TransactionList from "./components/TransactionList";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useDebounce } from "react-use";
import CustomSkeleton from "../../components/CustomSkeleton/CustomSkeleton";
import { withRouter } from "../../routes/utils";
function BlockDetail(props) {
  const [pageId, setPageId] = useState(undefined);
  const [blockHeight, setBlockHeight] = useState(undefined);
  const [blockInfo, setBlockInfo] = useState(undefined);
  const [transactionList, setTransactionList] = useState([]);
  const [retryBlockInfoCount, setRetryBlockInfoCount] = useState(0);
  const [bestChainHeight, setBestChainHeight] = useState(undefined);
  const [showExtensionInfo, setShowExtensionInfo] = useState(false);
  const [activeKey, setActiveKey] = useState("overview");
  const isMobile = useMobile();
  const retryBlockInfoLimit = 2;

  const jumpLink = useMemo(() => {
    const prevLink = `/block/${+blockHeight - 1}`;
    const nextLink = `/block/${+blockHeight + 1}`;

    return (
      <span className='jump-link'>
        <Link to={prevLink} disabled={+blockHeight === 1}>
          <IconFont type='left' />
        </Link>
        <Link to={nextLink}>
          <IconFont style={{ transform: "rotate(180deg)" }} type='left' />
        </Link>
      </span>
    );
  }, [blockHeight]);

  useEffect(() => {
    const { params, location } = props;
    const { id } = params;
    setPageId(id);
    setBlockInfo(undefined);
    setShowExtensionInfo(false);
    setActiveKey("overview");
    if (location.search && location.search.includes("tab=txns")) {
      setActiveKey("transactions");
    }
  }, [props]);

  useDebounce(
    () => {
      try {
        fetchBlockInfo();
      } catch (error) {
        console.log(">>>error", error);
      }
    },
    1000,
    [pageId]
  );

  const merge = useCallback((data = [], contractNames) => {
    return (data || []).map((item) => ({
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
      .catch((error) => {
        location.href = "/search-failed";
      });
  }, [aelf]);

  const getTxsList = useCallback(
    async (blockHash, page) => {
      let getTxsOption = {
        limit: 1000,
        page: page || 0,
        order: "asc",
        block_hash: blockHash,
      };

      let data = await get("/block/transactions", getTxsOption).catch(
        (error) => {
          console.log(">>>>error", error);
          location.href = "/search-failed";
        }
      );
      const contractNames = await getContractNames().catch((error) => {
        console.log(">>>>error", error);
        location.href = "/search-failed";
      });
      data = {
        ...data,
        transactions: merge(data.transactions || [], contractNames),
      };
      return data;
    },
    [get, getContractNames, merge]
  );

  const getDataFromHeight = useCallback(
    async (blockHeight) => {
      try {
        const result = await aelf.chain
          .getBlockByHeight(blockHeight, false)
          .catch((error) => {
            location.href = "/search-failed";
          });
        const { BlockHash: blockHash } = result;
        const { transactions = [] } = blockHash
          ? await getTxsList(blockHash).catch((error) => {
              location.href = "/search-failed";
            })
          : {};
        return { blockInfo: result, transactionList: transactions };
      } catch (err) {
        console.error("err", err);
        return { blockInfo: undefined, transactionList: undefined };
      }
    },
    [aelf, getTxsList]
  );

  const getDataFromHash = useCallback(
    async (blockHash) => {
      const { match, location } = props;
      const { id } = match.params;
      const txsList = await getTxsList(blockHash);
      const { transactions = [] } = txsList;
      if (!transactions[0]) {
        location.href = "/search-invalid/" + id;
      }
      const { block_height: blockHeight } = transactions[0];
      const result = await aelf.chain
        .getBlockByHeight(blockHeight, false)
        .catch((error) => {
          location.href = "/search-failed";
        });
      return { blockInfo: result, transactionList: transactions };
    },
    [aelf, getTxsList]
  );

  const fetchBlockInfo = useCallback(async () => {
    if (!pageId) return;
    const input = pageId;
    const chainStatus = await getChainStatus();
    const { BestChainHeight, LastIrreversibleBlockHeight = 0 } = chainStatus;
    setBestChainHeight(LastIrreversibleBlockHeight);

    let result;
    let blockHeight;
    let txsList = [];
    let error;
    if (parseInt(input, 10) == input) {
      blockHeight = input;
      if (blockHeight > BestChainHeight) {
        message.error(
          `${blockHeight} is larger than current chain best height ${BestChainHeight}`
        );
      } else {
        const data = await getDataFromHeight(input);
        result = data.blockInfo;
        txsList = data.transactionList;
      }
    } else {
      const data = await getDataFromHash(input);
      result = data.blockInfo;
      txsList = data.transactionList;
      error = txsList.length ? "" : "Not Found";
      blockHeight = result.Header.Height;
    }
    setBlockHeight(blockHeight);
    setTransactionList(txsList);

    get(BLOCK_INFO_API_URL, {
      height: blockHeight,
    })
      .then((res = { miner: "", dividends: "" }) => {
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
              merkleTreeRootOfTransactionState:
                header.MerkleTreeRootOfTransactionState,
              extra: header.Extra,
              bloom: header.Bloom,
              signerPubkey: header.SignerPubkey,
            },
          });
        } else {
          location.href = "/search-invalid/" + pageId;
        }
      })
      .catch((error) => {
        location.href = "/search-failed";
      });
    // Dismiss manually and asynchronously
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
    <div
      className={`block-detail-container basic-container-new ${
        isMobile && "mobile"
      }`}
    >
      <h2>
        Block
        {blockHeight && <Tag className='block-height'>#{blockHeight}</Tag>}
        {blockHeight && jumpLink}
      </h2>
      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
        <TabPane tab='Overview' key='overview'>
          <div className='overview-container'>
            <CustomSkeleton loading={!blockInfo}>
              {blockInfo && (
                <>
                  <BasicInfo
                    basicInfo={blockInfo.basicInfo}
                    bestChainHeight={bestChainHeight}
                  />
                  {showExtensionInfo && (
                    <ExtensionInfo extensionInfo={blockInfo.extensionInfo} />
                  )}
                  <Button
                    className={`show-more-btn ${
                      showExtensionInfo ? "more" : "less"
                    }`}
                    type='link'
                    onClick={() => setShowExtensionInfo(!showExtensionInfo)}
                  >
                    Click to see {!showExtensionInfo ? "More" : "Less"}
                    <IconFont type='shouqijiantou' />
                  </Button>
                </>
              )}
            </CustomSkeleton>
          </div>
        </TabPane>
        <TabPane tab='Transactions' key='transactions'>
          <div className='transactions-container'>
            <TransactionList allData={transactionList} />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default withRouter(BlockDetail);
