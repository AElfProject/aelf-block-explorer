/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-08-31 17:47:40
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-12-10 16:56:29
 * @Description: pages for vote & election
 */
import React, { Component } from "react";
import { Modal, Form, Input, message, Menu } from "antd";
import { Route, Routes } from "react-router-dom";
import moment from "moment";
import { isPhoneCheck } from "@utils/deviceCheck";
import { thousandsCommaWithDecimal } from "@utils/formater";
import getContractAddress from "@utils/getContractAddress";
import config, { schemeIds as originSchemeIds } from "@config/config";
import { connect } from "react-redux";
import { setContractWithName } from "@actions/voteContracts.ts";
import Decimal from "decimal.js";
import debounce from "lodash.debounce";
import { SYMBOL, ELF_DECIMAL, NEED_PLUGIN_AUTHORIZE_TIP } from "@src/constants";
import getStateJudgment from "@utils/getStateJudgment";
import publicKeyToAddress from "@utils/publicKeyToAddress";
import { getAllTeamDesc } from "@api/vote";
import { WebLoginState } from "aelf-web-login";
import "./index.less";
import MyVote from "./MyVote/MyVote";
import ElectionNotification from "./ElectionNotification/ElectionNotification";
import KeyInTeamInfo from "./KeyInTeamInfo";
import TeamDetail from "./TeamDetail";
import VoteModal from "./VoteModal";
import DividendModal from "./DividendModal";
import RedeemModal from "./RedeemModal";
// eslint-disable-next-line import/no-named-as-default
import RedeemAnVoteModal from "./RedeemAnVoteModal";
import * as constants from "./constants";
import {
  contractsNeedToLoad,
  FROM_WALLET,
  FROM_EXPIRED_VOTES,
  FROM_ACTIVE_VOTES,
  routePaths,
} from "./constants";
import { getFormatedLockTime } from "./utils";
import getAllTokens from "../../utils/getAllTokens";
import addressFormat from "../../utils/addressFormat";
import { withRouter } from "../../routes/utils";
import { WebLoginInstance } from "../../utils/webLogin";
import { fakeWallet } from "../../common/utils";

const voteConfirmFormItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

const handleschemeIds = (arr) => {
  const map = {
    "Citizen Welfare": "Voter Basic Rewards",
    "Backup Subsidy": "Candidate Node Rewards",
    "Miner Basic Reward": "BP Basic Rewards",
    "Welcome Reward": "New BP Rewards",
    "Flexible Reward": "Voter Flexible Rewards",
  };
  const result = arr.map((ele) => {
    ele.title = map[ele.type];
    return ele;
  });
  [result[2], result[3]] = [result[3], result[2]];
  return result;
};
const schemeIds = handleschemeIds(originSchemeIds);

const handleProfitsMap = (value, decimals) => {
  value = !value
    ? {
        ELF: 0,
      }
    : value;
  value = Object.keys(value).reduce((acc, key) => {
    return {
      ...acc,
      [key]: new Decimal(value[key] || 0)
        .dividedBy(`1e${decimals[key] || 8}`)
        .toNumber(),
    };
  }, {});
  return value;
};
class VoteContainer extends Component {
  constructor(props) {
    super(props);
    const { contractsStore } = props;
    this.state = {
      voteModalVisible: false,
      voteConfirmModalVisible: false,
      voteRedeemModalVisible: false,
      voteConfirmForm: {},
      voteRedeemForm: {},
      // eslint-disable-next-line react/no-unused-state
      voteFrom: 1,
      consensusContract: contractsStore.consensusContract,
      dividendContract: contractsStore.dividendContract,
      multiTokenContract: contractsStore.multiTokenContract,
      voteContract: contractsStore.voteContract,
      electionContract: contractsStore.electionContract,
      profitContract: contractsStore.profitContract,
      // eslint-disable-next-line react/no-unused-state
      voteContractFromExt: null,
      electionContractFromExt: null,
      profitContractFromExt: null,
      balance: null,
      formattedBalance: null,
      nodeAddress: null,
      nodeName: null,
      currentWalletName: null,
      voteAmountInput: null,
      lockTime: null,
      isCandidate: false,
      expiredVotesAmount: 0,
      activeVotingRecords: [],
      switchableVoteRecords: [],
      withdrawnableVoteRecords: [],
      switchVoteAmount: 0,
      voteFromExpiredVoteAmount: null,
      voteType: FROM_WALLET,
      voteLoading: false,
      switchVoteSelectedRowKeys: [],
      voteFromExpiredSelectedRowKeys: [],
      dividendModalVisible: false,
      claimDividendModalVisible: false,
      dividends: {
        total: {},
        amounts: schemeIds.map((v) => ({
          ...v,
          amount: {},
        })),
      },
      totalVoteAmountForOneCandidate: 0,
      totalWithdrawnableVoteAmountForOneCandidate: 0,
      redeemableVoteRecordsForOneCandidate: [],
      activeVoteRecordsForOneCandidate: [],
      redeemVoteSelectedRowKeys: [],
      targetPublicKey: null,
      nodeTableRefreshTime: new Date().getTime(),
      shouldRefreshNodeTable: false,
      shouldRefreshMyWallet: false,
      shouldRefreshElectionNotifiStatis: false,
      shouldJudgeIsCurrentCandidate: true,
      voteToRedeem: {
        nodeName: null,
        nodeAddress: null,
        amount: null,
        voteId: {
          value: null,
        },
      },
      redeemOneVoteModalVisible: false,
      voteConfirmLoading: false, // with setVoteConfirmLoading
      redeemConfirmLoading: false, // with setVoteConfirmLoading
      // isPluginLock: false,
      dividendLoading: false,
      claimLoading: {},
      claimDisabled: false,
    };

    this.isPhone = isPhoneCheck();
    this.loginMessageLock = false;
    // this.loginPlugin = this.loginPlugin.bind(this);

    this.changeModalVisible = this.changeModalVisible.bind(this);
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleLockTimeChange = this.handleLockTimeChange.bind(this);
    this.handleVoteConfirmOk = this.handleVoteConfirmOk.bind(this);
    this.handleVoteTypeChange = this.handleVoteTypeChange.bind(this);
    this.handleSwitchVoteSelectedRowChange =
      this.handleSwitchVoteSelectedRowChange.bind(this);
    this.handleVoteFromExpiredSelectedRowChange =
      this.handleVoteFromExpiredSelectedRowChange.bind(this);
    this.handleRedeemVoteSelectedRowChange =
      this.handleRedeemVoteSelectedRowChange.bind(this);
    this.handleRedeemConfirm = this.handleRedeemConfirm.bind(this);
    this.handleDividendClick = this.handleDividendClick.bind(this);
    this.handleClaimDividendClick = this.handleClaimDividendClick.bind(this);
    this.changeVoteState = this.changeVoteState.bind(this);
    this.checkExtensionLockStatus = this.checkExtensionLockStatus.bind(this);
    this.handleRedeemOneVoteConfirm =
      this.handleRedeemOneVoteConfirm.bind(this);
    this.hasGetContractsFromExt = false;
    this.hasfetchProfitAmount = false;
    this.setVoteConfirmLoading = this.setVoteConfirmLoading.bind(this);
    this.setRedeemConfirmLoading = this.setRedeemConfirmLoading.bind(this);
    this.claimProfits = this.claimProfits.bind(this);
    this.judgeCurrentUserIsCandidate =
      this.judgeCurrentUserIsCandidate.bind(this);
  }

  async componentDidMount() {
    // Get contracts
    try {
      const result = await getContractAddress();
      if (!result.chainInfo) {
        message.error(
          "The chain has stopped or cannot be connected to the chain. Please check your network or contact us.",
          10
        );
        return;
      }
      await contractsNeedToLoad.forEach(async (contractItem) => {
        await this.getContractByContractAddress(
          result,
          contractItem.contractAddrValName,
          contractItem.contractNickname
        );
      });
      // jump from other page with wallet address
      if (this.props.currentWallet?.address) {
        console.log("mount fetchGetContractsAndProfitAmount");
        await this.fetchGetContractsAndProfitAmount();
      }
    } catch (e) {
      console.error(e);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      shouldRefreshMyWallet,
      electionContract,
      shouldJudgeIsCurrentCandidate,
    } = this.state;
    const { currentWallet } = this.props;
    if (
      currentWallet?.address &&
      (shouldRefreshMyWallet || !prevProps.currentWallet?.address)
    ) {
      console.log("checkExtensionLockStatus", shouldRefreshMyWallet);
      // this.checkExtensionLockStatus();
      this.fetchGetContractsAndProfitAmount();
    }
    if (
      electionContract &&
      currentWallet?.address &&
      shouldJudgeIsCurrentCandidate
    ) {
      this.judgeCurrentUserIsCandidate();
    }
  }

  setVoteConfirmLoading(isLoading) {
    this.setState({
      voteConfirmLoading: isLoading,
    });
  }

  setRedeemConfirmLoading(isLoading) {
    this.setState({
      redeemConfirmLoading: isLoading,
    });
  }

  getWalletBalance() {
    const { currentWallet } = this.props;
    const { multiTokenContract } = this.state;
    return multiTokenContract.GetBalance.call({
      symbol: SYMBOL,
      owner: currentWallet?.address,
    });
  }

  /**
   * @description
   * @param {*} result
   * @param {*} contractNickname e.g. nickname: election, formal name: AElf.ContractNames.Election
   * @memberof ElectionNotification
   */
  getContractByContractAddress(result, contractAddrValName, contractNickname) {
    const { setContractWithName: setContract, aelf } = this.props;
    aelf.chain
      .contractAt(result[contractAddrValName], result.wallet)
      .then((res) => {
        setContract(contractNickname, res);
        this.setState({ [contractNickname]: res }, () => {
          if (contractNickname === "consensusContract") {
            this.chainInfo = res;
          }
        });
      })
      .catch((err) => console.error("err", err));
  }

  getNightElfKeyPair(wallet) {
    if (!wallet) {
      return;
    }
    wallet.formattedAddress = addressFormat(wallet.address);
    this.setState({
      showWallet: true,
    });
  }

  handleSwitchVoteSelectedRowChange(selectedRowKeys, selectedRows) {
    const switchVoteAmount = selectedRows.reduce(
      (total, current) => total + +current.amount,
      0
    );
    this.setState({
      switchVoteSelectedRowKeys: selectedRowKeys,
      switchVoteAmount,
    });
  }

  handleVoteFromExpiredSelectedRowChange(selectedRowKeys, selectedRows) {
    const voteFromExpiredVoteAmount = selectedRows.reduce(
      (total, current) => total + +current.amount,
      0
    );
    this.setState({
      voteFromExpiredSelectedRowKeys: selectedRowKeys,
      voteFromExpiredVoteAmount,
    });
  }

  handleRedeemVoteSelectedRowChange(selectedRowKeys) {
    this.setState({
      redeemVoteSelectedRowKeys: selectedRowKeys,
    });
  }

  fetchContractFromExt() {
    const { contractsNeedToLoadFromExt } = constants;
    const { aelf } = this.props;
    const result = {};
    return new Promise((resolve) => {
      Promise.all(
        contractsNeedToLoadFromExt.map(
          ({ contractAddrValName, contractNickname }) => {
            // TODO: need instance replace aelf
            return aelf.chain
              .contractAt(config[contractAddrValName], fakeWallet)
              .then((res) => {
                result[contractNickname] = res;
              });
          }
        )
      ).then(() => {
        this.setState(result, () => {
          resolve();
        });
      });
    });
  }

  changeModalVisible(modal, visible) {
    this.setState({
      [modal]: visible,
    });
  }

  changeVoteState(obj, callback) {
    this.setState(obj, callback);
  }

  handleOk(visible, cb) {
    this.setState(
      {
        [visible]: false,
      },
      cb
    );
  }

  handleCancel(visible) {
    this.setState({
      [visible]: false,
    });
  }

  fetchDataVoteNeed() {
    const { electionContract } = this.state;
    const { currentWallet } = this.props;

    Promise.all([
      this.getElectorVote(currentWallet, electionContract),
      getAllTeamDesc(),
    ])
      .then((resArr) => {
        this.processDataVoteNeed(resArr);
      })
      .catch((err) => {
        console.error("GetElectorVote", err);
      });
  }

  processDataVoteNeed(resArr) {
    // todo: the process code are  similar, can i unify it? Don't forget to consider the changablity.
    const { targetPublicKey } = this.state;
    const electorVote = resArr[0] || {};
    let allTeamInfo = null;
    let expiredVotesAmount = 0;
    if (resArr[1].code === 0) {
      allTeamInfo = resArr[1].data;
    }
    const { activeVotingRecords = [] } = electorVote;
    const switchableVoteRecords = [];
    const withdrawableVoteRecords = [];
    activeVotingRecords.forEach((record) => {
      // filter the vote voted to other node
      if (record.candidate === targetPublicKey) return;
      // filter the vote don't expired
      // todo: extract the judge code, there are some same code in page "my vote"
      if (record.unlockTimestamp.seconds > moment().unix()) {
        switchableVoteRecords.push(record);
        return;
      }
      // the vote expired can be withdrawn
      withdrawableVoteRecords.push(record);
      expiredVotesAmount += +record.amount;
    });

    [...switchableVoteRecords, ...withdrawableVoteRecords].forEach((record) => {
      const { voteTimestamp, lockTime } = record;
      const teamInfo = allTeamInfo.find(
        (team) => team.public_key === record.candidate
      );
      if (teamInfo === undefined) {
        record.address = publicKeyToAddress(record.candidate);
        record.name = addressFormat(record.address);
      } else {
        record.name = teamInfo.name;
      }
      // Antd's Table's datasource needs key
      record.key = record.voteId;

      // todo: unify lock time & vote time's handler
      // todo: fix the lock time
      record.formatedLockTime = `${(lockTime / 24 / 60 / 60).toFixed(1)} Days`;
      record.formatedVoteTime = moment
        .unix(voteTimestamp.seconds)
        .format("YYYY-MM-DD HH:mm:ss");
    });

    const switchVoteSelectedRowKeys = switchableVoteRecords.map(
      (ele) => ele.key
    );
    this.setState({
      expiredVotesAmount,
      activeVotingRecords,
      switchableVoteRecords,
      switchVoteSelectedRowKeys,
      withdrawnableVoteRecords: withdrawableVoteRecords,
    });
  }

  async getCandidateInfo(currentWallet, electionContract) {
    const { publicKey, address } = currentWallet;
    if (!publicKey && !address) {
      return null;
    }
    let res;
    if (publicKey) {
      res = await electionContract.GetCandidateInformation.call({
        value: publicKey,
      });
    }
    if (!res) {
      res = await electionContract.GetCandidateInformation.call({
        value: address,
      });
    }
    return res || {};
  }

  judgeCurrentUserIsCandidate() {
    const { currentWallet } = this.props;
    const { electionContract } = this.state;
    this.setState(
      {
        shouldJudgeIsCurrentCandidate: false,
      },
      () => {
        this.getCandidateInfo(currentWallet, electionContract)
          .then((res) => {
            this.setState({
              isCandidate: res.isCurrentCandidate,
            });
          })
          .catch((err) => {
            console.error("GetCandidateInformation", err);
          });
      }
    );
  }

  handleClick(e) {
    const ele =
      JSON.stringify(e.target.dataset) !== "{}"
        ? e.target
        : e.target.parentNode;
    const {
      role = "default",
      shoulddetectlock: shouldDetectLock,
      votetype: voteType,
      targetpublickey: targetPublicKey,
    } = ele.dataset;

    const role2Fun = {
      vote: this.handleVote.bind(this, targetPublicKey, voteType, ele),
      redeem: this.handleRedeemClick.bind(this, ele),
      redeemOne: this.handleRedeemOneVote.bind(this, ele),
      default: undefined,
    };

    const { [role]: fun } = role2Fun;
    if (voteType === FROM_WALLET && this.props.currentWallet?.address) {
      this.setState({
        voteLoading: true,
      });
    }
    if (shouldDetectLock && fun) {
      // const { currentWallet } = this.props;
      // To make sure that all the operation use wallet take effects on the correct wallet
      this.checkExtensionLockStatus().then(() => {
        // if (!currentWallet.address) {
        //   this.setState({
        //     shouldRefreshMyWallet: true,
        //   });
        // }
        fun();
      });
    }
  }

  handleVote(targetPublicKey, voteType, ele) {
    // const { currentWallet } = this.props;
    // if (
    //   (currentWallet.portkeyInfo || currentWallet.discoverInfo) &&
    //   !currentWallet.nightElfInfo
    // ) {
    //   onlyOkModal({
    //     message: `Voting with smart contract wallet addresses are currently not supported.`,
    //   });
    //   return;
    // }
    this.judgeANodeIsCandidate(targetPublicKey).then((res) => {
      if (res) {
        this.setState({ voteType }, this.handleVoteClick.bind(this, ele));
      } else {
        console.log("Cannot Vote");
      }
    });
  }

  judgeANodeIsCandidate(publickey) {
    const { electionContract } = this.state;
    return electionContract.GetCandidateInformation.call({
      value: publickey,
    })
      .then((res) => res.isCurrentCandidate)
      .catch((err) => {
        console.error("GetCandidateInformation", err);
      });
  }

  handleRedeemOneVote(ele) {
    const {
      nodeaddress: nodeAddress,
      nodename: nodeName,
      amount,
      voteid,
    } = ele.dataset;
    const voteId = JSON.parse(voteid);

    this.setState({
      voteToRedeem: {
        nodeName,
        nodeAddress,
        amount,
        voteId,
      },
      redeemOneVoteModalVisible: true,
    });
  }

  handleRedeemOneVoteConfirm() {
    const { voteToRedeem } = this.state;

    // todo: get the contract from extension in cdm or other suitable time
    // todo: error handle
    this.redeemSomeVote([voteToRedeem.voteId]);
    // todo: use async instead
    setTimeout(() => {
      this.setState({
        redeemOneVoteModalVisible: false,
      });
    }, 4000);
  }

  async fetchGetContractsAndProfitAmount() {
    if (!this.hasGetContractsFromExt) {
      await this.fetchContractFromExt();
      this.hasGetContractsFromExt = true;
    }
    await this.fetchProfitAmount();
    // if (!this.hasfetchProfitAmount) {
    //   this.hasfetchProfitAmount = true;

    // }
    return Promise.resolve();
  }

  checkExtensionLockStatus() {
    const { currentWallet } = this.props;

    return new Promise((resolve) => {
      if (currentWallet?.address) {
        return resolve();
        // if (this.hasGetContractsFromExt) {
        //   return resolve();
        // }
        // return this.fetchGetContractsAndProfitAmount().then(() => {
        //   resolve();
        // });
      }
      return WebLoginInstance.get().loginAsync().then(resolve);
      // .then(async () => {
      //   if (this.hasGetContractsFromExt) {
      //     return resolve();
      //   }
      //   await this.fetchGetContractsAndProfitAmount();
      //   return resolve();
      // });
    });
  }

  handleVoteClick(ele) {
    const {
      nodeaddress: nodeAddress,
      targetpublickey: targetPublicKey,
      nodename: nodeName = "",
    } = ele.dataset;
    this.getWalletBalance().then(
      (res) => {
        // todo: unify balance formater: InputNumber's and thousandsCommaWithDecimal's
        const balance = +res.balance / ELF_DECIMAL;
        const formattedBalance = thousandsCommaWithDecimal(balance);
        this.fetchDataVoteNeed();
        this.setState({
          balance,
          nodeAddress,
          targetPublicKey,
          currentWalletName: this.props.currentWallet.name,
          formattedBalance,
          nodeName,
        });
        this.setState({
          voteLoading: false,
        });
        this.changeModalVisible("voteModalVisible", true);
      },
      () => {
        this.setState({
          voteLoading: false,
        });
      }
    );
  }

  handleRedeemClick(ele) {
    const {
      nodename: nodeName = "Default",
      nodeaddress: nodeAddress,
      targetpublickey: targetPublicKey,
    } = ele.dataset;
    // todo: use arrow function or others method instead the data binded to element
    // todo: consider remove all the form in state

    this.setState(
      {
        nodeName,
        nodeAddress,
        targetPublicKey,
        voteRedeemModalVisible: true,
      },
      () => {
        this.fetchUserVoteRecords();
      }
    );
  }

  handleRedeemConfirm() {
    const { redeemVoteSelectedRowKeys } = this.state;

    this.redeemSomeVote(redeemVoteSelectedRowKeys);
  }

  redeemSomeVote(votesToRedeem) {
    const { electionContractFromExt } = this.state;
    // no batch redeem
    const [item] = votesToRedeem;
    if (!item) {
      message.error("No selected vote");
      this.setVoteConfirmLoading(false);
      this.setRedeemConfirmLoading(false);
    } else {
      WebLoginInstance.get()
        .callContract({
          contractAddress: electionContractFromExt.address,
          methodName: "Withdraw",
          args: item,
        })
        .then((res) => {
          const { error, errorMessage } = res;
          if (+error === 0 || !error) {
            this.checkTransactionResult(res, "voteRedeemModalVisible")
              .then(() => {
                this.refreshPageElectionNotifi();
              })
              .catch((err) => {
                console.error("checkTransactionResult", {
                  err,
                });
              });
            this.setState({
              redeemVoteSelectedRowKeys: [],
            });
          } else {
            this.setVoteConfirmLoading(false);
            this.setRedeemConfirmLoading(false);
            message.error(errorMessage.message);
          }
        })
        .catch((err) => {
          this.setVoteConfirmLoading(false);
          this.setRedeemConfirmLoading(false);
          console.error(err);
        });
    }
  }

  async getElectorVote(currentWallet, electionContract) {
    const { publicKey, address } = currentWallet;
    if (!publicKey && !address) {
      return null;
    }
    let res;
    if (publicKey) {
      res = await electionContract.GetElectorVoteWithRecords.call({
        value: publicKey,
      });
    }
    if (!res) {
      res = await electionContract.GetElectorVoteWithRecords.call({
        value: address,
      });
    }
    return res || {};
  }

  fetchUserVoteRecords() {
    const { electionContract, targetPublicKey } = this.state;
    const { currentWallet } = this.props;

    this.getElectorVote(currentWallet, electionContract)
      .then((res) => {
        // todo: error handle
        const activeVoteRecordsForOneCandidate = res.activeVotingRecords.filter(
          (item) => item.candidate === targetPublicKey
        );
        const redeemableVoteRecordsForOneCandidate =
          this.computeRedeemableVoteRecords(activeVoteRecordsForOneCandidate);

        redeemableVoteRecordsForOneCandidate.forEach((item) => {
          item.formatedLockTime = getFormatedLockTime(item);
          item.formatedVoteTime = moment
            .unix(item.voteTimestamp.seconds)
            .format("YYYY-MM-DD HH:mm:ss");
          // todo: use the name team submit instead
          item.name = publicKeyToAddress(item.candidate);
        });

        // todo: consider to generate redeemableVoteRecordsForOneCandidate in component RedeemModal, it will reduce state's counts
        this.setState({
          activeVoteRecordsForOneCandidate,
          redeemableVoteRecordsForOneCandidate,
        });
      })
      .catch((err) => {
        console.log("GetElectorVoteWithRecords", err);
      });
  }

  computeRedeemableVoteRecords(records) {
    return records.filter(
      (item) => item.unlockTimestamp.seconds < moment().unix()
    );
  }

  handleLockTimeChange(value) {
    this.setState({
      lockTime: value,
    });
  }

  handleVoteConfirmOk() {
    const { voteType } = this.state;
    const type2Fun = {
      [FROM_WALLET]: this.handleVoteFromWallet.bind(this),
      [FROM_EXPIRED_VOTES]: this.handleVoteFromExpiredVote.bind(this),
      [FROM_ACTIVE_VOTES]: this.handleSwitchVote.bind(this),
    };
    if (type2Fun[voteType]) {
      type2Fun[voteType]();
    }
  }

  handleVoteFromWallet() {
    const { voteAmountInput, targetPublicKey, electionContractFromExt } =
      this.state;
    const { lockTime } = this.state;

    const payload = {
      candidatePubkey: targetPublicKey,
      // todo: add decimal or not
      amount: voteAmountInput * ELF_DECIMAL,
      endTimestamp: {
        seconds: lockTime.unix(),
        nanos: lockTime.milliseconds() * 1000000,
      },
    };
    WebLoginInstance.get()
      .callContract({
        contractAddress: electionContractFromExt.address,
        methodName: "Vote",
        args: payload,
      })
      .then((res) => {
        // todo: error format maybe wrong
        const { error, errorMessage } = res;
        if (+error === 0 || !error) {
          this.checkTransactionResult(res).then(() => {
            // Close tow modal as there are two situation, one open a modal and anothor open two modals.
            // Consider to do the samething after checkTransactionResult in the same page.
            this.setState(
              {
                voteConfirmModalVisible: false,
                voteModalVisible: false,
                voteConfirmLoading: false,
              },
              () => {
                this.refreshPageElectionNotifi();
              }
            );
          });
        } else {
          message.error(error.message || errorMessage.message);
          this.setState({
            voteConfirmLoading: false,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          voteConfirmLoading: false,
        });
      });
  }

  refreshPageElectionNotifi() {
    this.setState({
      nodeTableRefreshTime: new Date().getTime(),
      shouldRefreshNodeTable: true,
      shouldRefreshMyWallet: true,
      shouldRefreshElectionNotifiStatis: true,
      voteConfirmLoading: false,
    });
  }

  handleVoteFromExpiredVote() {
    const { voteFromExpiredVoteAmount, withdrawnableVoteRecords } = this.state;
    const votesToRedeem = [];
    const sortedRedeemableVoteRecords = withdrawnableVoteRecords.sort(
      (a, b) => b.amount - a.amount
    );
    let voteIdsToRedeem = null;
    for (let i = 0; i < sortedRedeemableVoteRecords.length; i++) {
      const item = sortedRedeemableVoteRecords[i];
      votesToRedeem.push(item);
      const totalAmount = votesToRedeem.reduce(
        (total, current) => total + +current.amount,
        0
      );
      if (totalAmount >= voteFromExpiredVoteAmount) {
        break;
      }
    }
    voteIdsToRedeem = votesToRedeem.map((item) => item.voteId);
    this.redeemSomeVote(voteIdsToRedeem);
  }

  // todo: global node address are public key actually
  handleSwitchVote() {
    const { electionContractFromExt, targetPublicKey } = this.state;
    // todo: limit max change num or handle the concurreny problem
    const { switchVoteSelectedRowKeys } = this.state;
    const payload = {
      voteId: switchVoteSelectedRowKeys[0],
      candidatePubkey: targetPublicKey,
      isResetVotingTime: true,
    };
    WebLoginInstance.get()
      .callContract({
        contractAddress: electionContractFromExt.address,
        methodName: "ChangeVotingOption",
        args: payload,
      })
      .then((res) => {
        const { error, errorMessage } = res;
        if (+error === 0 || !error) {
          this.checkTransactionResult(res).then(() => {
            // Close tow modal as there are two situcation, one open a modal and anothor open two modals.
            // Consider to do the samething after checkTransactionResult in the same page.
            this.setState(
              {
                voteConfirmModalVisible: false,
                voteModalVisible: false,
                voteConfirmLoading: false,
              },
              () => {
                this.refreshPageElectionNotifi();
              }
            );
          });
        } else {
          message.error(errorMessage.message);
          this.setVoteConfirmLoading(false);
        }
      })
      .catch((err) => {
        console.error("ChangeVotingOption", err);
        this.setVoteConfirmLoading(false);
      });
  }

  // todo: use this method instead repeat code
  checkTransactionResult(res, modalToClose, intervalFlag) {
    const { aelf } = this.props;
    const { dividends } = this.state;
    const transactionId =
      res?.TransactionId ||
      res?.result?.TransactionId ||
      res.transactionId ||
      "";
    return new Promise((resolve, reject) => {
      if (intervalFlag) {
        let cancelFlag = false;
        // pending status will request next time
        const interval = setInterval(() => {
          // request transactionId 4s one time
          aelf.chain.getTxResult(transactionId, (error, result) => {
            if (
              (result?.Status === "NOTEXISTED") |
              (result?.Status === "FAILED") |
              (result?.Status === "UNEXECUTABLE")
            ) {
              getStateJudgment(result.Status, transactionId);
              cancelFlag = true;
              clearInterval(interval);
              return reject();
            } else if (result?.Status === "NODEVALIDATIONFAILED") {
              message.error(error?.Error || error?.message);
              cancelFlag = true;
              clearInterval(interval);
              return reject();
            } else if (result?.Status === "MINED") {
              getStateJudgment(result.Status, transactionId);
              cancelFlag = true;
              clearInterval(interval);
              // close modal
              if (modalToClose) {
                setTimeout(() => {
                  if (modalToClose === "dividendModalVisible") {
                    // all profit has been got
                    const getAllFlag = dividends.amounts.every((ele) => {
                      return JSON.stringify(ele.amounts) === "{}";
                    });
                    if (!getAllFlag) return;
                  }
                  this.changeModalVisible(modalToClose, false);
                }, 500);
              }
              return resolve();
            }
          });
        }, 4000);
        setTimeout(() => {
          if (!cancelFlag) {
            message.info(
              "Temporaryly didn' get the transaction info. Please query the transaction later"
            );
            message.info(`Your transaction id is: ${transactionId}`);
          }
          clearInterval(interval);
          return resolve();
        }, 60000);
      } else {
        setTimeout(() => {
          aelf.chain.getTxResult(transactionId, (error, result) => {
            if (!result) {
              message.info(
                "Temporaryly didn' get the transaction info. Please query the transaction later"
              );
              message.info(`Your transaction id is: ${transactionId}`);
              reject();
              return;
            }
            getStateJudgment(result.Status, transactionId);
            // todo: use the modalToClose instead the VoteConfirmModal's code
            if (modalToClose) {
              setTimeout(() => {
                this.changeModalVisible(modalToClose, false);
              }, 500);
            }
            // todo: return resolve for all four status, consider to return resolve just for the 'mined', 'pending'
            resolve();
          });
        }, 4000);
      }
    });
  }

  handleVoteTypeChange(voteType) {
    this.setState({
      voteType,
    });
  }

  fetchProfitAmount() {
    const { currentWallet } = this.props;
    if (!currentWallet?.address) {
      return Promise.resolve();
    }
    const { profitContractFromExt } = this.state;
    return Promise.all([
      getAllTokens(),
      ...schemeIds.map((item) => {
        return profitContractFromExt.GetAllProfitsMap.call({
          beneficiary: currentWallet?.address,
          schemeId: item.schemeId,
        });
      }),
    ])
      .then((resArr) => {
        const [tokens, ...list] = resArr;
        const decimals = tokens.reduce(
          (acc, v) => ({
            [v.symbol]: v.decimals,
          }),
          {}
        );
        let total = {};
        const dividendAmounts = schemeIds.map((item, index) => {
          const profit = list[index];
          const result = profit ? profit.result || profit : {};

          let { allProfitsMap = {}, oneTimeClaimableProfitsMap = {} } =
            result || {};
          allProfitsMap = handleProfitsMap(allProfitsMap, decimals);
          oneTimeClaimableProfitsMap = handleProfitsMap(
            oneTimeClaimableProfitsMap,
            decimals
          );
          total = {
            ...total,
            ...Object.keys(allProfitsMap).reduce((acc, key) => {
              return {
                ...acc,
                [key]: (total[key] || 0) + allProfitsMap[key],
              };
            }, {}),
          };
          return {
            type: item.type,
            amounts: allProfitsMap,
            oneTimeProfits: oneTimeClaimableProfitsMap,
            schemeId: item.schemeId,
            title: item.title,
          };
        });
        const dividends = {
          total,
          amounts: dividendAmounts,
        };
        console.log(dividends, "fetchProfitAmount");
        this.setState({
          dividends,
        });
        return dividends;
      })
      .catch((err) => {
        console.error("fetchProfitAmount", err);
      });
  }

  handleDividendClick() {
    const handleDividendClick = async () => {
      const { currentWallet } = this.props;
      try {
        if (!currentWallet?.address) {
          await WebLoginInstance.get().loginAsync();
        }
        try {
          this.setState({
            dividendModalVisible: true,
            dividendLoading: true,
          });
          await this.fetchGetContractsAndProfitAmount();
        } catch (e) {
          console.log(e);
          message.error("Error happened when getting claim amount");
        } finally {
          this.setState({
            dividendLoading: false,
          });
        }
      } catch (err) {
        console.error("checkExtensionLockStatus", err);
      }
    };
    handleDividendClick();
  }

  claimProfits(item) {
    const { schemeId } = item;
    const needMoreTime = item.amounts["ELF"] > item.oneTimeProfits["ELF"];
    const { currentWallet } = this.props;
    const { profitContractFromExt } = this.state;
    const webLoginContext = WebLoginInstance.get().getWebLoginContext();
    const { loginState } = webLoginContext;
    this.setState({
      claimDisabled: true,
    });
    // setTimeout(() => {
    //   this.setState({
    //     claimDisabled: false,
    //   });
    //   setTimeout(() => {
    //     console.log(
    //       { ...this.state.claimLoading, [item.title]: false },
    //       "xxxx"
    //     );
    //     this.setState({
    //       claimLoading: {
    //         ...this.state.claimLoading,
    //         [item.title]: false,
    //       },
    //     });
    //   }, 8000);
    // }, 1000);
    if (loginState === WebLoginState.logined) {
      WebLoginInstance.get()
        .callContract({
          contractAddress: profitContractFromExt.address,
          methodName: "ClaimProfits",
          args: {
            schemeId,
            beneficiary: currentWallet?.address,
          },
        })
        .then((res) => {
          this.setState({
            claimDisabled: false,
          });
          const { error, errorMessage } = res;
          if (+error === 0 || !error) {
            (needMoreTime
              ? this.checkTransactionResult(
                  res,
                  "claimDividendModalVisible",
                  true
                )
              : this.checkTransactionResult(res, "dividendModalVisible", true)
            )
              .then(async () => {
                await this.fetchProfitAmount();
                this.setState({
                  claimLoading: {
                    ...this.state.claimLoading,
                    [item.title]: false,
                  },
                });
              })
              .catch((err) => {
                this.setState({
                  claimLoading: {
                    ...this.state.claimLoading,
                    [item.title]: false,
                  },
                });
                message.error(err?.Error || err?.message);
                console.error("handleClaimDividendClick", err);
              });
          } else {
            message.error(errorMessage.message);
            this.setState({
              claimLoading: {
                ...this.state.claimLoading,
                [item.title]: false,
              },
            });
          }
        })
        .catch((err) => {
          this.setState({
            claimDisabled: false,
            claimLoading: {
              ...this.state.claimLoading,
              [item.title]: false,
            },
          });
          console.error("handleClaimDividendClick", err);
        });
    }
  }

  handleClaimDividendClick(item) {
    this.setState({
      claimLoading: {
        ...this.state.claimLoading,
        [item.title]: true,
      },
    });
    // console.log(
    //   {
    //     ...claimLoading,
    //     [item.title]: true,
    //   },
    //   "yyy"
    // );
    // now only ELF
    const needMoreTime = item.amounts["ELF"] > item.oneTimeProfits["ELF"];
    if (needMoreTime) {
      Modal.confirm({
        className: "claim-dividend-modal",
        title: `Claim ${item.title}`,
        centered: true,
        content: `You are about to claim ${item.oneTimeProfits["ELF"]} ELF in this transaction. You may initiate several transactions to claim all rewards.`,
        onOk: debounce(() => this.claimProfits(item), 500),
        onCancel: debounce(() => {
          this.setState({
            claimLoading: {
              [item.title]: false,
            },
          });
        }, 100),
        closable: true,
        icon: null,
        width: 442,
      });
      return;
    }
    this.claimProfits(item);
  }

  renderSecondaryLevelNav() {
    return (
      <section className="vote-container vote-container-simple basic-container basic-container-white vote-menu">
        <Menu selectedKeys={[window.location.pathname]} mode="horizontal">
          <Menu.Item
            key={routePaths.electionNotifi}
            onClick={() => {
              this.props.navigate(routePaths.electionNotifi);
            }}
          >
            Election Notification
          </Menu.Item>
          <Menu.Item
            key={routePaths.myVote}
            onClick={() => {
              this.props.navigate(routePaths.myVote);
            }}
          >
            My Vote
          </Menu.Item>
        </Menu>
      </section>
    );
  }

  render() {
    const {
      voteModalVisible,
      voteConfirmModalVisible,
      voteRedeemModalVisible,
      voteConfirmForm,
      voteContract,
      electionContract,
      multiTokenContract,
      profitContract,
      dividendContract,
      consensusContract,
      electionContractFromExt,
      profitContractFromExt,
      balance,
      nodeAddress,
      nodeName,
      currentWalletName,
      voteAmountInput,
      voteFromExpiredVoteAmount,
      lockTime,
      isCandidate,
      expiredVotesAmount,
      switchableVoteRecords,
      withdrawnableVoteRecords,
      voteType,
      switchVoteSelectedRowKeys,
      voteFromExpiredSelectedRowKeys,
      redeemVoteSelectedRowKeys,
      dividendModalVisible,
      redeemableVoteRecordsForOneCandidate,
      activeVoteRecordsForOneCandidate,
      dividends,
      shouldRefreshNodeTable,
      nodeTableRefreshTime,
      shouldRefreshMyWallet,
      voteToRedeem,
      redeemOneVoteModalVisible,
      shouldRefreshElectionNotifiStatis,
      isPluginLock,
      dividendLoading,
      voteConfirmLoading,
      redeemConfirmLoading,
      claimLoading,
      claimDisabled,
      voteLoading,
    } = this.state;

    const path2Component = [
      [
        routePaths.electionNotifi,
        <ElectionNotification
          multiTokenContract={multiTokenContract}
          voteContract={voteContract}
          electionContract={electionContract}
          profitContract={profitContract}
          profitContractFromExt={profitContractFromExt}
          dividendContract={dividendContract}
          consensusContract={consensusContract}
          isCandidate={isCandidate}
          judgeCurrentUserIsCandidate={this.judgeCurrentUserIsCandidate}
          handleDividendClick={this.handleDividendClick}
          dividends={dividends}
          electionContractFromExt={electionContractFromExt}
          shouldRefreshNodeTable={shouldRefreshNodeTable}
          nodeTableRefreshTime={nodeTableRefreshTime}
          shouldRefreshMyWallet={shouldRefreshMyWallet}
          changeVoteState={this.changeVoteState}
          checkExtensionLockStatus={this.checkExtensionLockStatus}
          shouldRefreshElectionNotifiStatis={shouldRefreshElectionNotifiStatis}
        />,
      ],
      [
        routePaths.teamInfoKeyin,
        <KeyInTeamInfo
          electionContract={electionContract}
          isPluginLock={isPluginLock}
          checkExtensionLockStatus={this.checkExtensionLockStatus}
        />,
      ],
      [
        routePaths.teamDetail,
        <TeamDetail
          consensusContract={consensusContract}
          electionContract={electionContract}
        />,
      ],
      [
        routePaths.myVote,
        <MyVote
          electionContract={electionContract}
          handleVoteTypeChange={this.handleVoteTypeChange}
          checkExtensionLockStatus={this.checkExtensionLockStatus}
        />,
      ],
    ];

    const secondaryLevelNav = this.renderSecondaryLevelNav();
    return (
      <div className="vote-wrapper">
        <header>Vote</header>
        {secondaryLevelNav}
        <section
          className="vote-container vote-container-simple basic-container basic-container-white vote-content"
          onClick={this.handleClick}
        >
          <Routes>
            {path2Component.map((item) => (
              <Route path={item[0].split("/vote")[1]} element={item[1]} />
            ))}
          </Routes>

          <VoteModal
            voteModalVisible={voteModalVisible}
            nodeAddress={nodeAddress}
            nodeName={nodeName}
            currentWalletName={currentWalletName}
            balance={balance}
            callback={this.handleVoteConfirmOk}
            setVoteConfirmLoading={this.setVoteConfirmLoading}
            voteConfirmLoading={voteConfirmLoading}
            onCancel={this.handleCancel.bind(this, "voteModalVisible")}
            handleSwitchVoteAmountChange={this.handleSwitchVoteAmountChange}
            handleLockTimeChange={this.handleLockTimeChange}
            voteAmountInput={voteAmountInput}
            lockTime={lockTime}
            expiredVotesAmount={expiredVotesAmount}
            switchableVoteRecords={switchableVoteRecords}
            withdrawnableVoteRecords={withdrawnableVoteRecords}
            handleSwitchVote={this.handleSwitchVote}
            handleVoteTypeChange={this.handleVoteTypeChange}
            voteType={voteType}
            handleSwitchVoteSelectedRowChange={
              this.handleSwitchVoteSelectedRowChange
            }
            switchVoteSelectedRowKeys={switchVoteSelectedRowKeys}
            voteFromExpiredVoteAmount={voteFromExpiredVoteAmount}
            voteFromExpiredSelectedRowKeys={voteFromExpiredSelectedRowKeys}
            handleVoteFromExpiredSelectedRowChange={
              this.handleVoteFromExpiredSelectedRowChange
            }
            changeVoteState={this.changeVoteState}
          />

          <Modal
            className="vote-confirm-modal"
            title="Vote Confirm"
            visible={voteConfirmModalVisible}
            onOk={this.handleVoteConfirmOk}
            onCancel={this.handleCancel.bind(this, "voteConfirmModalVisible")}
            width={860}
            centered
            maskClosable
            keyboard
          >
            <Form {...voteConfirmFormItemLayout} onSubmit={this.handleSubmit}>
              {voteConfirmForm.formItems &&
                voteConfirmForm.formItems.map((item) => {
                  return (
                    <Form.Item label={item.label} key={item.label}>
                      {item.render ? item.render : <Input />}
                    </Form.Item>
                  );
                })}
            </Form>
            <p className="tip-color" style={{ marginTop: 30 }}>
              {NEED_PLUGIN_AUTHORIZE_TIP}
            </p>
          </Modal>

          <RedeemModal
            nodeAddress={nodeAddress}
            nodeName={nodeName}
            voteRedeemModalVisible={voteRedeemModalVisible}
            setRedeemConfirmLoading={this.setRedeemConfirmLoading}
            redeemConfirmLoading={redeemConfirmLoading}
            handleRedeemConfirm={this.handleRedeemConfirm}
            handleCancel={this.handleCancel}
            redeemableVoteRecordsForOneCandidate={
              redeemableVoteRecordsForOneCandidate
            }
            activeVoteRecordsForOneCandidate={activeVoteRecordsForOneCandidate}
            redeemVoteSelectedRowKeys={redeemVoteSelectedRowKeys}
            handleRedeemVoteSelectedRowChange={
              this.handleRedeemVoteSelectedRowChange
            }
            changeVoteState={this.changeVoteState}
          />

          <RedeemAnVoteModal
            voteToRedeem={voteToRedeem}
            redeemOneVoteModalVisible={redeemOneVoteModalVisible}
            changeVoteState={this.changeVoteState}
            handleRedeemOneVoteConfirm={this.handleRedeemOneVoteConfirm}
          />

          <DividendModal
            dividendModalVisible={dividendModalVisible}
            loading={dividendLoading}
            changeModalVisible={this.changeModalVisible}
            dividends={dividends}
            handleClaimDividendClick={this.handleClaimDividendClick}
            claimLoading={claimLoading}
            claimDisabled={claimDisabled}
          />

          <Modal
            open={voteLoading}
            centered
            footer={null}
            className="vote-btn-loading"
            width={252}
          >
            Loading...
          </Modal>
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const contractsStore = state.voteContracts;
  const { currentWallet, aelf } = state.common;
  return {
    currentWallet,
    contractsStore,
    aelf,
  };
};

const mapDispatchToProps = {
  setContractWithName,
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(VoteContainer)
);
