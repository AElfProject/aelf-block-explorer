import React, { useState, useEffect } from "react";
import moment from "moment";
import StatisticalData from "@components/StatisticalData/";
import { getAllTeamDesc, fetchPageableCandidateInformation } from "@api/vote";
import publicKeyToAddress from "@utils/publicKeyToAddress";
import {
  RANK_NOT_EXISTED_SYMBOL,
  ELF_DECIMAL,
  myVoteStatistData,
} from "@src/pages/Vote/constants";
import { MY_VOTE_DATA_TIP } from "@src/constants";
import { Button, Spin } from "antd";
import NightElfCheck from "../../../utils/NightElfCheck";
import getLogin from "../../../utils/getLogin";
import MyVoteRecord from "./MyVoteRecords";
import { getPublicKeyFromObject } from "../../../utils/getPublicKey";
import addressFormat from "../../../utils/addressFormat";

import "./MyVote.style.less";

const MyVote = (props) => {
  const [statistData, setStatistData] = useState(myVoteStatistData);
  const [tableData, setTableData] = useState([]);
  const [spinningLoading, setSpinningLoading] = useState(true);
  const [currentWallet, setCurrentWallet] = useState({
    address: null,
    name: null,
    pubKey: {
      x: null,
      y: null,
    },
  });

  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    if (props.currentWallet) {
      getCurrentWallet();
    }
  }, [props.currentWallet]);

  useEffect(() => {
    if (props.currentWallet && !hasRun) {
      fetchTableDataAndStatistData();
      setHasRun(true);
    }
  }, [props.currentWallet, hasRun]);

  const getCurrentWallet = () => {
    NightElfCheck.getInstance()
      .check.then((ready) => {
        const nightElf = NightElfCheck.getAelfInstanceByExtension();
        getLogin(
          nightElf,
          { file: "MyVote.js" },
          (result) => {
            if (result.error) {
              setSpinningLoading(false);
            } else {
              const wallet = JSON.parse(result.detail);
              const newCurrentWallet = {
                formattedAddress: addressFormat(wallet.address),
                address: wallet.address,
                name: wallet.name,
                pubKey: getPublicKeyFromObject(wallet.publicKey),
              };
              setCurrentWallet(newCurrentWallet);
              props.checkExtensionLockStatus();
              setTimeout(() => {
                fetchTableDataAndStatistData(newCurrentWallet);
              });
            }
          },
          false
        );
      })
      .catch((error) => {
        setSpinningLoading(false);
      });
  };

  const fetchTableDataAndStatistData = (currentWalletTemp) => {
    const { electionContract } = props;
    if (!electionContract) return;
    setHasRun(true);
    const newCurrentWallet = currentWalletTemp || currentWallet;
    if (!newCurrentWallet || !newCurrentWallet.address) {
      setHasRun(false);
      return false;
    }

    Promise.all([
      electionContract.GetElectorVoteWithAllRecords.call({
        value: newCurrentWallet.pubKey,
      }),
      getAllTeamDesc(),
      fetchPageableCandidateInformation(electionContract, {
        start: 0,
        length: 20,
      }),
    ])
      .then((resArr) => {
        processData(resArr);
      })
      .catch((err) => {
        console.error("err", "fetchTableDataAndStatistData", err);
      });
  };

  const processData = (resArr) => {

    // 更新状态
    setTableData(tableData);
    setSpinningLoading(false);
  };

  const processStatistData = (key, param, value) => {
    // 更新状态
    setStatistData({
      ...statistData,
      [key]: {
        ...(statistData[key] || {}),
        [param]: value,
      },
    });
    setSpinningLoading(false);
  };

  const onLogin = () => {
    getCurrentWallet();
  };

  return (
    <section>
      {currentWallet.address ? (
        <Spin spinning={spinningLoading}>
          <StatisticalData data={statistData} tooltip={MY_VOTE_DATA_TIP} />
          <MyVoteRecord data={tableData} />
        </Spin>
      ) : (
        <div className="not-logged-section">
          <p>It seems like you are not logged in.</p>
          <Button onClick={onLogin} type="primary">
            Login
          </Button>
        </div>
      )}
    </section>
  );
};

export default MyVote;
