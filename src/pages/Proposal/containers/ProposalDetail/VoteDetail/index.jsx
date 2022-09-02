/**
 * @file vote detail
 * @author atom-yang
 */
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Input,
  Button,
  Table,
  Pagination,
  message,
  Tag,
  Typography,
} from "antd";
import Decimal from "decimal.js";
import moment from "moment";
import { If, Then } from "react-if";
import config from "../../../../../common/config";
import { request } from "../../../../../common/request";
import Total from "../../../../../components/Total";
import constants, {
  API_PATH,
  LOG_STATUS,
  LOADING_STATUS,
  ACTIONS_COLOR_MAP,
} from "../../../common/constants";
import { getContractAddress, sendTransaction } from "../../../common/utils";
import "./index.less";
import { removePrefixOrSuffix } from "../../../../../common/utils";
import TableLayer from "../../../../../components/TableLayer/TableLayer";

const { Title } = Typography;
const { viewer } = config;

const { Search } = Input;

const { proposalTypes, proposalStatus } = constants;

function getList(params) {
  return request(API_PATH.GET_VOTED_LIST, params, { method: "GET" });
}

async function getPersonalVote(params) {
  return request(
    API_PATH.GET_PERSONAL_VOTED_LIST,
    {
      ...params,
    },
    { method: "GET" }
  );
}

const listColumn = [
  {
    title: "Voter",
    dataIndex: "voter",
    key: "voter",
    ellipsis: true,
    width: 300,
    render: (voter) => (
      <a
        href={`${viewer.addressUrl}/${voter}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {`ELF_${voter}_${viewer.chainId}`}
      </a>
    ),
  },
  {
    title: "Transaction Id",
    dataIndex: "txId",
    key: "txId",
    ellipsis: true,
    width: 300,
    render: (txId) => (
      <a
        href={`${viewer.txUrl}/${txId}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {txId}
      </a>
    ),
  },
  {
    title: "Type",
    dataIndex: "action",
    key: "action",
    render(action) {
      return <Tag color={ACTIONS_COLOR_MAP[action]}>{action}</Tag>;
    },
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
    render(time) {
      return moment(time).format("YYYY/MM/DD HH:mm:ss");
    },
  },
];

const referendumListColumn = [...listColumn];
referendumListColumn.splice(
  2,
  0,
  {
    title: "Symbol",
    dataIndex: "symbol",
    key: "symbol",
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
  }
);

const personListColumn = referendumListColumn.slice(1);

const VoteDetail = (props) => {
  const {
    proposalId,
    proposalType,
    logStatus,
    wallet,
    currentWallet,
    expiredTime,
    status,
    symbol,
  } = props;
  const [list, setList] = useState({
    loadingStatus: LOADING_STATUS.LOADING,
    list: [],
    total: 0,
    params: {
      proposalId,
      pageSize: 20,
      pageNum: 1,
      search: "",
    },
  });
  const [personVote, setPersonVote] = useState({
    list: [],
    left: 0,
    canReclaim: false,
  });

  function fetchList(params) {
    setList({
      ...list,
      loadingStatus: LOADING_STATUS.LOADING,
    });
    getList(params)
      .then((result) => {
        setList({
          ...list,
          params,
          list: result.list,
          total: result.total,
          loadingStatus: LOADING_STATUS.SUCCESS,
        });
      })
      .catch((e) => {
        console.error(e);
        setList({
          ...list,
          params,
          list: [],
          total: 0,
          loadingStatus: LOADING_STATUS.FAILED,
        });
      });
  }

  async function reclaimToken() {
    await sendTransaction(
      wallet,
      getContractAddress(proposalTypes.REFERENDUM),
      "ReclaimVoteToken",
      proposalId
    );
  }

  useEffect(() => {
    fetchList(list.params);
  }, [proposalId]);

  useEffect(() => {
    if (
      logStatus === LOG_STATUS.LOGGED &&
      proposalType === proposalTypes.REFERENDUM
    ) {
      getPersonalVote({
        proposalId,
        address: currentWallet.address,
      })
        .then((votes) => {
          const left = votes.reduce(
            (acc, v) => (v.claimed ? acc : acc.add(new Decimal(v.amount))),
            new Decimal(0)
          );
          setPersonVote({
            list: votes,
            left: left.toString(),
            // eslint-disable-next-line max-len
            canReclaim:
              left.gt(0) &&
              (moment(expiredTime).isBefore(moment()) ||
                status === proposalStatus.RELEASED),
          });
        })
        .catch((e) => {
          message.error(e.message || "Get personal vote history failed");
        });
    }
  }, [proposalId, logStatus]);

  function onSearch(value) {
    fetchList({
      ...list.params,
      pageNum: 1,
      search: removePrefixOrSuffix((value || "").trim()),
    });
  }

  function onPageNumChange(pageNum) {
    fetchList({
      ...list.params,
      pageNum,
    });
  }

  return (
    <div className="vote-detail">
      <If
        condition={
          logStatus === LOG_STATUS.LOGGED &&
          proposalType === proposalTypes.REFERENDUM &&
          personVote.list.length > 0
        }
      >
        <Then>
          <div className="vote-detail-personal gap-bottom-small">
            <Title level={4}>Personal Votes</Title>
            <div className="vote-detail-personal-total gap-bottom">
              <span className="sub-title gap-right-small">Token Voted:</span>
              <span>
                {personVote.left}
                <Tag color="blue">{symbol}</Tag> left
              </span>
              <Button
                className="gap-left"
                type="primary"
                disabled={!personVote.canReclaim}
                onClick={reclaimToken}
              >
                Reclaim
              </Button>
            </div>
            <TableLayer>
              <Table
                showSorterTooltip={false}
                dataSource={personVote.list}
                columns={personListColumn}
                rowKey="txId"
                pagination={false}
                scroll={{ x: 980 }}
              />
            </TableLayer>
          </div>
        </Then>
      </If>
      <Title level={4} className="gap-top-large">
        All Votes
      </Title>
      <Search
        className="vote-detail-search"
        placeholder="Input voter address/transaction id"
        onSearch={onSearch}
      />
      <TableLayer className="vote-detail-content gap-top-large">
        <Table
          showSorterTooltip={false}
          dataSource={list.list}
          columns={
            proposalType === proposalTypes.REFERENDUM
              ? referendumListColumn
              : listColumn
          }
          loading={list.loadingStatus === LOADING_STATUS.LOADING}
          rowKey="txId"
          pagination={false}
          scroll={{ x: 980 }}
        />
      </TableLayer>
      <Pagination
        className="float-right gap-top"
        showQuickJumper
        total={list.total}
        current={list.params.pageNum}
        pageSize={list.params.pageSize}
        hideOnSinglePage
        onChange={onPageNumChange}
        showTotal={Total}
      />
    </div>
  );
};

VoteDetail.propTypes = {
  proposalType: PropTypes.oneOf(Object.values(proposalTypes)).isRequired,
  proposalId: PropTypes.string.isRequired,
  logStatus: PropTypes.oneOf(Object.values(LOG_STATUS)).isRequired,
  wallet: PropTypes.shape({
    sign: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
  }).isRequired,
  currentWallet: PropTypes.shape({
    address: PropTypes.string,
    publicKey: PropTypes.string,
  }).isRequired,
  expiredTime: PropTypes.string.isRequired,
  status: PropTypes.oneOf(Object.values(proposalStatus)).isRequired,
  symbol: PropTypes.string.isRequired,
};

export default VoteDetail;
