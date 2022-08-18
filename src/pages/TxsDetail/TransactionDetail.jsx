import { Button, Tabs } from "antd";
import React, { useState } from "react";
// import { useParams } from "react-router";
import { useEffectOnce } from "react-use";
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

export default function TransactionDetail() {
  // const { id } = useParams();
  const { pathname } = location;
  const id = pathname.split("/")[2];
  const [lastHeight, setLastHeight] = useState(undefined);
  const [info, setInfo] = useState(undefined);
  const [contractName, setContractName] = useState("");
  const [parsedLogs, setParsedLogs] = useState([]);
  const [showExtensionInfo, setShowExtensionInfo] = useState(false);

  const isMobile = useMobile();

  useEffectOnce(() => {
    aelf.chain.getChainStatus().then(({ LastIrreversibleBlockHeight }) => {
      setLastHeight(LastIrreversibleBlockHeight);
    });
    aelf.chain.getTxResult(id).then((res) => {
      getContractNames()
        .then((names) => {
          const { isSystemContract, contractName } =
            names[res.Transaction.To] || {};
          const name = isSystemContract
            ? removeAElfPrefix(contractName)
            : contractName;
          setContractName(name || res.Transaction.To);
        })
        .catch((e) => {
          console.log(e);
        });
      getInfoBackUp(res).then((backup) => {
        console.log(">>>>", res, backup, JSON.parse(res.Transaction.Params));
        setInfo({ ...res, ...backup });
      });
    });
  });

  useEffect(() => {
    const { Logs = [] } = info || {};
    const logs = [...parsedLogs];
    if (Logs) {
      const arr = Logs.filter((item) => item.Name === "Transferred");
      arr.forEach((item, index) => {
        deserializeLog(item).then((res) => {
          logs.push({ ...res, key: arr[index].Name + arr[index].Address });
          setParsedLogs(logs);
        });
      });
    }
  }, [info]);

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

  return (
    <div
      className={`tx-block-detail-container basic-container-new ${
        isMobile && "mobile"
      }`}
    >
      <h2>Transaction Details</h2>
      <Tabs>
        <TabPane tab="Overview" key="overview">
          {info && (
            <div className="overview-container">
              <BasicInfo
                info={info}
                parsedLogs={parsedLogs}
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
            {info &&
              info.Logs &&
              (Array.isArray(info.Logs) ? (
                <Events list={info.Logs} key={id} />
              ) : (
                <CodeBlock value={info.logs} />
              ))}
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}
