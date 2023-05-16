import React, { Component } from "react";
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

export default class MyVote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statistData: myVoteStatistData,
      tableData: [],
      spinningLoading: true,
      currentWallet: {
        address: null,
        name: null,
        publicKey: null,
      },
    };

    this.hasRun = false;
  }

  componentDidMount() {
    if (this.props.currentWallet) {
      this.getCurrentWallet();
    }
  }

  // todo: update the vote info after switch to this tab
  componentDidUpdate(prevProps) {
    if (this.props.currentWallet && !prevProps.currentWallet) {
      this.getCurrentWallet();
    }
    if (
      prevProps.currentWallet &&
      prevProps.currentWallet.address !== this.props.currentWallet.address
    ) {
      this.getCurrentWallet();
    }
    if (!this.hasRun) {
      this.fetchTableDataAndStatistData();
    }
  }

  getCurrentWallet() {
    const { checkExtensionLockStatus } = this.props;
    return checkExtensionLockStatus().then(
      () => {
        const wallet = JSON.parse(localStorage.getItem("currentWallet"));
        if (wallet) {
          this.setState({
            loading: true,
            currentWallet: {
              ...wallet,
              formattedAddress: addressFormat(wallet.address),
            },
          });
        }
        this.fetchTableDataAndStatistData(wallet);
      },
      () => {
        this.setState({
          spinningLoading: false,
        });
      },
      () => {
        this.setState({
          spinningLoading: false,
        });
      }
    );
  }

  fetchTableDataAndStatistData(currentWalletTemp) {
    const { electionContract } = this.props;
    if (!electionContract) return;
    this.hasRun = true;
    const currentWallet = currentWalletTemp || this.state.currentWallet;
    if (!currentWallet || !currentWallet.address) {
      this.hasRun = false;
      // eslint-disable-next-line consistent-return
      return false;
    }

    // todo: is it ok to get the same data twice in different tabs
    // todo: add error handle
    Promise.all([
      electionContract.GetElectorVoteWithAllRecords.call({
        value: currentWallet.publicKey,
      }),
      getAllTeamDesc(),
      fetchPageableCandidateInformation(electionContract, {
        start: 0,
        // length: A_NUMBER_LARGE_ENOUGH_TO_GET_ALL // FIXME:
        length: 20,
      }),
    ])
      .then((resArr) => {
        this.processData(resArr);
      })
      .catch((err) => {
        console.error("err", "fetchTableDataAndStatistData", err);
      });
  }

  processData(resArr) {
    const electorVotes = resArr[0];
    const allNodeInfo = (resArr[2] ? resArr[2].value : [])
      .sort((a, b) => +b.obtainedVotesAmount - +a.obtainedVotesAmount)
      .map((item, index) => {
        item.rank = index + 1;
        return item;
      });
    let allTeamInfo = null;
    const withdrawableVoteRecords = [];
    let withdrawableVoteAmount = 0;
    if (resArr[1].code === 0) {
      allTeamInfo = resArr[1].data;
    }

    const myVoteRecords = [
      ...electorVotes.activeVotingRecords,
      ...electorVotes.withdrawnVotesRecords,
    ];
    electorVotes.activeVotingRecords.forEach((record) => {
      if (record.unlockTimestamp.seconds < moment().unix()) {
        withdrawableVoteRecords.push(record);
      }
    });

    // assign rank
    myVoteRecords.forEach((record) => {
      const foundedNode = allNodeInfo.find(
        (item) => item.candidateInformation.pubkey === record.candidate
      );
      if (foundedNode === undefined) {
        // rank: used to sort
        record.rank = 9999999;
        // displayedRank: used to display
        record.displayedRank = RANK_NOT_EXISTED_SYMBOL;
      } else {
        record.rank = foundedNode.rank;
        record.displayedRank = foundedNode.rank;
      }
    });
    const myTotalVotesAmount = electorVotes.allVotedVotesAmount;
    withdrawableVoteAmount = withdrawableVoteRecords.reduce(
      (total, current) => total + +current.amount,
      0
    );
    this.processStatistData(
      "myTotalVotesAmount",
      "num",
      myTotalVotesAmount / ELF_DECIMAL
    );
    this.processStatistData(
      "withdrawableVotesAmount",
      "num",
      withdrawableVoteAmount / ELF_DECIMAL
    );
    this.processTableData(myVoteRecords, allTeamInfo);
  }

  // eslint-disable-next-line class-methods-use-this
  processTableData(myVoteRecords, allTeamInfo) {
    // add node name
    const tableData = myVoteRecords;
    tableData.forEach((record) => {
      const teamInfo = allTeamInfo.find(
        (team) => team.public_key === record.candidate
      );
      if (teamInfo === undefined) {
        record.address = publicKeyToAddress(record.candidate);
        record.name = addressFormat(record.address);
      } else {
        record.name = teamInfo.name;
      }
      if (record.isWithdrawn) {
        record.type = "Redeem";
        record.operationTime = moment
          .unix(record.withdrawTimestamp.seconds)
          .format("YYYY-MM-DD HH:mm:ss");
      } else if (record.isChangeTarget) {
        record.type = "Switch Vote";
        record.operationTime = moment
          .unix(record.voteTimestamp.seconds)
          .format("YYYY-MM-DD HH:mm:ss");
      } else {
        record.type = "Vote";
        record.operationTime = moment
          .unix(record.voteTimestamp.seconds)
          .format("YYYY-MM-DD HH:mm:ss");
      }
      record.status = "Success";
      const start = moment.unix(record.voteTimestamp.seconds);
      const end = moment.unix(record.unlockTimestamp.seconds);
      record.formattedLockTime = end.from(start, true);
      record.formattedUnlockTime = end.format("YYYY-MM-DD HH:mm:ss");
      record.isRedeemable = record.unlockTimestamp.seconds <= moment().unix();
    });
    // todo: withdrawn's timestamp

    this.setState({
      tableData,
      spinningLoading: false,
    });
  }

  processStatistData(key, param, value) {
    const { statistData } = this.state;
    this.setState({
      statistData: {
        ...statistData,
        [key]: {
          ...(statistData[key] || {}),
          [param]: value,
        },
      },
      spinningLoading: false,
    });
  }

  render() {
    const { statistData, spinningLoading, tableData, currentWallet } =
      this.state;

    const onLogin = () => {
      this.getCurrentWallet();
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
  }
}
