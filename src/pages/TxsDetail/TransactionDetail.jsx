import { Button, Tabs } from "antd";
import React, { useMemo, useState } from "react";
import { aelf, getContractNames } from "../../utils";
import { deserializeLog, getFee, removeAElfPrefix } from "../../utils/utils";

const { TabPane } = Tabs;

import "./TransactionDetail.styles.less";
import Events from "../../components/Events";
import { useEffect } from "react";
import ExtensionInfo from "./components/ExtensionInfo";
import BasicInfo from "./components/BasicInfo";
import CodeBlock from "../../components/CodeBlock/CodeBlock";
import IconFont from "../../components/IconFont";
import useMobile from "../../hooks/useMobile";
import { withRouter } from "react-router";
import { useCallback } from "react";

function TransactionDetail(props) {
  const { id } = props.match.params;
  const [lastHeight, setLastHeight] = useState(undefined);
  const [info, setInfo] = useState(undefined);
  const [contractName, setContractName] = useState("");
  const [parsedLogs, setParsedLogs] = useState([]);
  const [showExtensionInfo, setShowExtensionInfo] = useState(false);
  const [activeKey, setActiveKey] = useState("overview");
  const isMobile = useMobile();

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
    setActiveKey("overview");
    aelf.chain.getChainStatus().then(({ LastIrreversibleBlockHeight }) => {
      setLastHeight(LastIrreversibleBlockHeight);
    });
    aelf.chain
      .getTxResult(id)
      .then((res) => {
        getData(res);
      })
      .catch((e) => {
        getData(e);
      });
  }, [id]);

  useEffect(() => {
    const { Logs = [] } = info || {};
    const logs = [...parsedLogs];
    if (Logs) {
      const arr = Logs.filter((item) => item.Name === "Transferred");
      arr.forEach((item, index) => {
        deserializeLog(item).then((res) => {
          logs.push({ ...res, key: arr[index].Name + arr[index].Address });
          setParsedLogs([...logs]);
        });
      });
    }
  }, [info]);

  const logIsAllParsed = useMemo(() => {
    const { Logs = [] } = info || {};
    const arr = Logs.filter((item) => item.Name === "Transferred");
    return arr.length === parsedLogs.length;
  }, [parsedLogs, info]);

  async function getInfoBackUp(transaction) {
    const { BlockNumber } = transaction;
    const block = await aelf.chain.getBlockByHeight(BlockNumber, false);
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
      getContractNames().then((names) => {
        const { isSystemContract, contractName } =
          names[res.Transaction.To] || {};
        const name = isSystemContract
          ? removeAElfPrefix(contractName)
          : contractName;
        setContractName(name || res.Transaction.To);
      });
      getInfoBackUp(res).then((backup) => {
        setInfo({ ...res, ...backup });
      });
    },
    [getContractNames, getInfoBackUp]
  );

  return (
    <div
      className={`tx-block-detail-container basic-container-new ${
        isMobile && "mobile"
      }`}
    >
      <h2>Transaction Details</h2>
      <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)}>
        <TabPane tab="Overview" key="overview">
          {info && (
            <div className="overview-container">
              <BasicInfo
                info={info}
                parsedLogs={parsedLogs}
                isDone={logIsAllParsed}
                lastHeight={lastHeight}
                contractName={contractName}
              />
              <ExtensionInfo transaction={info} show={showExtensionInfo} />
              <Button
                className={`show-more-btn ${
                  showExtensionInfo ? "more" : "less"
                }`}
                type="link"
                onClick={() => setShowExtensionInfo(!showExtensionInfo)}
              >
                Click to see {!showExtensionInfo ? "More" : "Less"}
                <IconFont type="shouqijiantou" />
              </Button>
            </div>
          )}
        </TabPane>
        <TabPane tab={`Logs (${info ? info.Logs.length : 0})`} key="logs">
          <div className="logs-container">
            {hasLogs ? (
              Array.isArray(info.Logs) ? (
                <Events list={info.Logs} key={id} />
              ) : (
                <CodeBlock value={info.Logs} />
              )
            ) : (
              <div className="no-data">No Data</div>
            )}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default withRouter(TransactionDetail);
