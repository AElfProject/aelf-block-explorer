import { Button, Tabs } from "antd";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { aelf, getContractNames } from "../../utils";
import { deserializeLog, getFee, removeAElfPrefix } from "../../utils/utils";
import "./TransactionDetail.styles.less";
import Events from "../../components/Events";
import ExtensionInfo from "./components/ExtensionInfo";
import BasicInfo from "./components/BasicInfo";
import CodeBlock from "../../components/CodeBlock/CodeBlock";
import IconFont from "../../components/IconFont";
import useMobile from "../../hooks/useMobile";
import CustomSkeleton from "../../components/CustomSkeleton/CustomSkeleton";
import { withRouter } from "../../routes/utils";
import removeHash from "../../utils/removeHash";
import { EXPLORER_V2_LINK } from "../../common/constants";
import { CHAIN_ID, NETWORK_TYPE } from "../../../config/config";

const { TabPane } = Tabs;

function TransactionDetail(props) {
  const { params } = props;
  const { id } = params;
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
    const { Logs = [] } = info || {};
    const logs = [...parsedLogs];
    if (Logs.length) {
      const arr = Logs.filter(
        item =>
          item.Name === "Transferred" ||
          item.Name === "CrossChainTransferred" ||
          item.Name === "CrossChainReceived"
      );
      arr.forEach((item, index) => {
        deserializeLog(item).then(res => {
          logs.push({ ...res, key: arr[index].Name + arr[index].Address });
          setParsedLogs([...logs]);
        });
      });
    } else {
      setParsedLogs([]);
    }
  }, [info]);

  const logIsAllParsed = useMemo(() => {
    const { Logs = [] } = info || {};
    const arr = Logs.filter(
      item =>
        item.Name === "Transferred" ||
        item.Name === "CrossChainTransferred" ||
        item.Name === "CrossChainReceived"
    );
    return arr.length === parsedLogs.length;
  }, [parsedLogs, info]);

  async function getInfoBackUp(transaction) {
    const { BlockNumber } = transaction;
    const block = await aelf.chain
      .getBlockByHeight(BlockNumber, false)
      .catch(() => {
        window.location.href = "/search-failed";
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
    res => {
      getContractNames()
        .then(names => {
          const { isSystemContract, contractName: nameOfContract } =
            names[res.Transaction.To] || {};
          const name = isSystemContract
            ? removeAElfPrefix(nameOfContract)
            : nameOfContract;
          setContractName(name || res.Transaction.To);
        })
        .catch(() => {
          window.location.href = "/search-failed";
        });
      getInfoBackUp(res).then(backup => {
        setInfo({ ...res, ...backup });
      });
    },
    [getContractNames, getInfoBackUp]
  );

  const renderLogData = () => {
    if (hasLogs) {
      if (Array.isArray(info.Logs)) {
        return <Events list={info.Logs} key={id} />;
      }
      return <CodeBlock value={info.Logs} />;
    }
    return <div className="no-data">No Data</div>;
  };

  useEffect(() => {
    const { location } = props;
    setShowExtensionInfo(false);
    setActiveKey("overview");
    if (location.hash === "#logs") {
      setActiveKey("logs");
    }
    setInfo(undefined);
    aelf.chain
      .getChainStatus()
      .then(({ LastIrreversibleBlockHeight }) => {
        setLastHeight(LastIrreversibleBlockHeight);
      })
      .catch(() => {
        window.location.href = "/search-failed";
      });
    aelf.chain
      .getTxResult(id)
      .then(res => {
        if (res.Status === "NOTEXISTED") {
          window.location.href = `/search-invalid/${res.TransactionId}`;
        } else {
          getData(res);
        }
      })
      .catch(e => {
        getData(e);
      });
  }, [id]);

  const changeTab = key => {
    if (key === "overview") {
      removeHash();
      setActiveKey("overview");
    } else {
      window.location.hash = "logs";
    }
  };

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#logs") {
      setActiveKey("logs");
    } else {
      setActiveKey("overview");
    }
  });

  return (
    <div
      className={`tx-block-detail-container basic-container-new ${
        isMobile && "mobile"
      }`}
    >
      <h2>
        Transaction Details
        <a
          className="view-on-v2"
          target="_blank"
          href={`${EXPLORER_V2_LINK[NETWORK_TYPE]}${CHAIN_ID}/tx/${id}`}
          rel="noreferrer"
        >
          View the transaction hash on aelfscan
        </a>
      </h2>

      <Tabs activeKey={activeKey} onChange={key => changeTab(key)}>
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
                </>
              )}
            </CustomSkeleton>
          </div>
        </TabPane>
        <TabPane tab={`Logs (${info ? info.Logs.length : 0})`} key="logs">
          <div className="logs-container">
            <CustomSkeleton loading={!info}>{renderLogData()}</CustomSkeleton>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default withRouter(TransactionDetail);
