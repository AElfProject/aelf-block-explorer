import { Button, Tabs } from 'antd';
import React, { useMemo, useState } from 'react';
import { aelf } from 'utils/axios';
import { getContractNames, deserializeLog, getFee, removeAElfPrefix } from '../../utils/utils';
import { ILog } from './types';
import Events from 'components/Events';
import { useEffect } from 'react';
import ExtensionInfo from './components/ExtensionInfo';
import BasicInfo from './components/BasicInfo';
import CodeBlock from 'components/CodeBlock/CodeBlock';
import IconFont from 'components/IconFont';
import { isPhoneCheck, isPhoneCheckSSR } from 'utils/deviceCheck';
import { useCallback } from 'react';
import CustomSkeleton from 'components/CustomSkeleton/CustomSkeleton';
import { withRouter } from 'next/router';
require('./TransactionDetail.styles.less');
const { TabPane } = Tabs;

function TransactionDetail(props) {
  const { id } = props.router.query;
  const [lastHeight, setLastHeight] = useState(props.lastheightssr);
  const [info, setInfo] = useState(props.infossr);
  const [contractName, setContractName] = useState(props.contractnamessr || '');
  const [parsedLogs, setParsedLogs] = useState(props.parsedlogsssr || []);
  const [showExtensionInfo, setShowExtensionInfo] = useState(false);
  const [activeKey, setActiveKey] = useState('overview');
  const [isMobile, setIsMobile] = useState(!!isPhoneCheckSSR(props.headers));

  useEffect(() => {
    setIsMobile(!!isPhoneCheck());
  }, []);

  const hasLogs = useMemo(() => {
    if (info) {
      if (Array.isArray(info.Logs)) {
        if (info.Logs.length) {
          return true;
        }
      } else if (info.Logs) {
        return true;
      }
    }
    return false;
  }, [info]);

  useEffect(() => {
    setShowExtensionInfo(false);
    setActiveKey('overview');
    aelf.chain
      .getChainStatus()
      .then(({ LastIrreversibleBlockHeight }) => {
        setLastHeight(LastIrreversibleBlockHeight);
      })
      .catch((_) => {
        location.href = '/search-failed';
      });
    aelf.chain
      .getTxResult(id)
      .then((res) => {
        if (res.Status === 'NOTEXISTED') {
          location.href = '/search-invalid/' + res.TransactionId;
        } else {
          getData(res);
        }
      })
      .catch((_) => {
        location.href = '/search-failed';
      });
  }, [id]);

  useEffect(() => {
    // make useEffect async
    const changeParsedLogs = async () => {
      const { Logs = [] } = info || {};
      const logs: ILog[] = [];
      if (Logs.length) {
        const arr = Logs.filter((item) => item.Name === 'Transferred');
        for (const item of arr) {
          const res = await deserializeLog(item);
          logs.push({ ...res, key: item.Name + item.Address });
        }
        setParsedLogs([...logs]);
      } else {
        setParsedLogs([]);
      }
    };
    changeParsedLogs();
  }, [info]);

  const logIsAllParsed = useMemo(() => {
    const { Logs = [] } = info || {};
    const arr = Logs.filter((item) => item.Name === 'Transferred');
    return arr.length === parsedLogs.length;
  }, [parsedLogs, info]);

  async function getInfoBackUp(transaction) {
    const { BlockNumber } = transaction;
    const block = await aelf.chain.getBlockByHeight(BlockNumber, false).catch((error) => {
      location.href = '/search-failed';
    });
    const {
      Header: { Time },
    } = block;
    return {
      ...(await getFee(transaction)),
      time: Time,
    };
  }

  const getData = useCallback(
    (res) => {
      getContractNames()
        .then((names) => {
          const { isSystemContract, contractName } = names[res.Transaction.To] || {};
          const name = isSystemContract ? removeAElfPrefix(contractName) : contractName;
          setContractName(name || res.Transaction.To);
        })
        .catch((_) => {
          location.href = '/search-failed';
        });
      getInfoBackUp(res)
        .then((backup) => {
          setInfo({ ...res, ...backup });
        })
        .catch((_) => {
          setInfo(undefined);
        });
    },
    [getContractNames, getInfoBackUp],
  );

  return (
    <div className={`tx-block-detail-container basic-container-new ${isMobile && 'mobile'}`}>
      <h2>Transaction Details</h2>
      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
        <TabPane tab="Overview" key="overview">
          <div className="overview-container">
            <CustomSkeleton loading={!info}>
              {info && (
                <>
                  <BasicInfo
                    info={info}
                    parsedLogs={parsedLogs}
                    isDone={logIsAllParsed}
                    lastHeight={lastHeight}
                    contractName={contractName}
                    tokenPrice={props.tokenpricessr}
                    decimals={props.decimalsssr}
                  />
                  <ExtensionInfo transaction={info} show={showExtensionInfo} />
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
        <TabPane tab={`Logs (${info ? info.Logs.length : 0})`} key="logs">
          <div className="logs-container">
            <CustomSkeleton loading={!info}>
              {hasLogs ? (
                Array.isArray(info.Logs) ? (
                  <Events list={info.Logs} key={id} />
                ) : (
                  <CodeBlock value={info.Logs} />
                )
              ) : (
                <div className="no-data">No Data</div>
              )}
            </CustomSkeleton>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default withRouter(TransactionDetail);
