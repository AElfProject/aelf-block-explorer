import React, { useState, useEffect } from 'react';
import moment from 'moment';

import StatisticalData from '@components/StatisticalData/';
import { getAllTeamDesc, fetchPageableCandidateInformation } from '@api/vote';
import publicKeyToAddress from '@utils/publicKeyToAddress';
import { RANK_NOT_EXISTED_SYMBOL , ELF_DECIMAL, myVoteStatistData } from '@src/pages/Vote/constants';
import { MY_VOTE_DATA_TIP } from '@src/constants';
import { Button, Spin } from 'antd';
import NightElfCheck from '../../../utils/NightElfCheck';
import getLogin from '../../../utils/getLogin';
import MyVoteRecord from './MyVoteRecords';
import { getPublicKeyFromObject } from '../../../utils/getPublicKey';
import addressFormat from '../../../utils/addressFormat';

import './MyVote.style.less';

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
    if (!hasRun) {
      fetchTableDataAndStatistData();
    }
  }, [hasRun]);

  
  const getCurrentWallet = () => {
    NightElfCheck.getInstance()
      .check.then((ready) => {
        const nightElf = NightElfCheck.getAelfInstanceByExtension();
        getLogin(
          nightElf,
          { file: 'MyVote.js' },
          (result) => {
            if (result.error) {
              setSpinningLoading(false);
            } else {
              const wallet = JSON.parse(result.detail);
              const currentWallet = {
                formattedAddress: addressFormat(wallet.address),
                address: wallet.address,
                name: wallet.name,
                pubKey: getPublicKeyFromObject(wallet.publicKey),
              };
              setCurrentWallet(currentWallet);
              props.checkExtensionLockStatus();
              setTimeout(() => {
                fetchTableDataAndStatistData(currentWallet);
              });
            }
          },
          false,
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
    const currentWallet = currentWalletTemp || currentWallet;
    if (!currentWallet || !currentWallet.address) {
      setHasRun(false);
      return false;
    }

    // todo: is it ok to get the same data twice in different tabs
    // todo: add error handle
    Promise.all([
      electionContract.GetElectorVoteWithAllRecords.call({
        value: currentWallet.pubKey,
      }),
      getAllTeamDesc(),
      fetchPageableCandidateInformation(electionContract, {
        start: 0,
        // length: A_NUMBER_LARGE_ENOUGH_TO_GET_ALL // FIXME:
        length: 20,
      }),
    ])
      .then((resArr) => {
        processData(resArr);
      })
      .catch((err) => {
        console.error('err', 'fetchTableDataAndStatistData', err);
      });
  };

  const processData = (resArr) => {
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
        (item) => item.candidateInformation.pubkey === record.candidate,
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
      0,
    );
    console.log({
      myTotalVotesAmount,
      withdrawableVoteAmount,
    });
    processStatistData(
      'myTotalVotesAmount',
      'num',
      myTotalVotesAmount / ELF_DECIMAL,
    );
    processStatistData(
      'withdrawableVotesAmount',
      'num',
      withdrawableVoteAmount / ELF_DECIMAL,
    );
    processTableData(myVoteRecords, allTeamInfo);
  };

  const processTableData = (myVoteRecords, allTeamInfo) => {
    // add node name
    const tableData = myVoteRecords;
    tableData.forEach((record) => {
      const teamInfo = allTeamInfo.find(
        (team) => team.public_key === record.candidate,
      );
      console.log('teamInfo', teamInfo);
      if (teamInfo === undefined) {
        record.address = publicKeyToAddress(record.candidate);
        record.name = addressFormat(record.address);
      } else {
        record.name = teamInfo.name;
      }
      if (record.isWithdrawn) {
        record.type = 'Redeem';
        record.operationTime = moment
          .unix(record.withdrawTimestamp.seconds)
          .format('YYYY-MM-DD HH:mm:ss');
      } else if (record.isChangeTarget) {
        record.type = 'Switch Vote';
        record.operationTime = moment
          .unix(record.voteTimestamp.seconds)
          .format('YYYY-MM-DD HH:mm:ss');
      } else {
        record.type = 'Vote';
        record.operationTime = moment
          .unix(record.voteTimestamp.seconds)
          .format('YYYY-MM-DD HH:mm:ss');
      }
      record.status = 'Success';
      console.log('record.lockTime', record.lockTime);
      const start = moment.unix(record.voteTimestamp.seconds);
      const end = moment.unix(record.unlockTimestamp.seconds);
      record.formattedLockTime = end.from(start, true);
      record.formattedUnlockTime = end.format('YYYY-MM-DD HH:mm:ss');
      record.isRedeemable = record.unlockTimestamp.seconds <= moment().unix();
    });
  
    setTableData(tableData);
    setSpinningLoading(false);
  };
  

  const processStatistData = (key, param, value) => {
    setStatistData({
      ...statistData,
      [key]: {
        ...(statistData[key] || {}),
        [param]: value
      }
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
