/* eslint-disable react/jsx-no-bind */
/**
 * @file proposal list
 * @author atom-yang
 */
// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from "react";
import { If, Then, Switch, Case } from "react-if";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import {
  message,
  Tabs,
  Pagination,
  Input,
  Checkbox,
  Select,
  Spin,
  Row,
  Col,
  Empty,
  Result,
  Modal,
} from "antd";
import { useEffectOnce } from "react-use";
import { useWebLogin } from "aelf-web-login";
import { showAccountInfoSyncingModal } from "../../../../components/SimpleModal/index.tsx";
import Total from "../../../../components/Total";
import constants, {
  LOADING_STATUS,
  LOG_STATUS,
} from "../../../../redux/common/constants";
import Proposal from "./Proposal";
import { getProposals } from "../../../../redux/actions/proposalList";
import ApproveTokenModal from "../../components/ApproveTokenModal";
import "./index.less";
import {
  getContractAddress,
  sendTransactionWith,
} from "../../../../redux/common/utils";
import { removePrefixOrSuffix, sendHeight } from "../../../../common/utils";
import removeHash from "../../../../utils/removeHash";

const { TabPane } = Tabs;
const { Search } = Input;
const { Option } = Select;
const { proposalTypes, proposalStatus } = constants;
const keyFromHash = {
  "#association": proposalTypes.ASSOCIATION,
  "#referendum": proposalTypes.REFERENDUM,
};

const ProposalList = () => {
  const common = useSelector((state) => state.common, shallowEqual);
  const proposalList = useSelector((state) => state.proposals, shallowEqual);
  const [proposalInfo, setProposalInfo] = useState({
    tokenSymbol: "ELF",
    action: "Approve",
    visible: false,
  });
  const { bpCount, params, total, list, status: loadingStatus } = proposalList;
  const { aelf, logStatus, isALLSettle, wallet, currentWallet } = common;
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState(params.search);
  const [activeKey, setActiveKey] = useState();
  const [loading, setLoading] = useState({
    Release: {},
    Approve: {},
    Reject: {},
    Abstain: {},
  });

  const { wallet: webLoginWallet, callContract } = useWebLogin();

  useEffect(() => {
    sendHeight(500);
  }, [list]);

  const fetchList = async (param) => {
    let newParams = {
      ...param,
    };
    delete newParams.address;
    if (logStatus === LOG_STATUS.LOGGED) {
      newParams = {
        ...newParams,
        address: currentWallet.address,
      };
    }
    dispatch(getProposals(newParams));
  };
  useEffect(() => {
    if (isALLSettle === true) {
      fetchList(params);
    }
  }, [isALLSettle, logStatus]);

  useEffect(() => {
    setSearchValue(params.search);
  }, [params.search]);

  const onPageNumChange = (pageNum) =>
    fetchList({
      ...params,
      pageNum,
    });

  const onSearch = async (value) => {
    await fetchList({
      ...params,
      pageNum: 1,
      search: removePrefixOrSuffix((value || "").trim()),
    });
  };

  const handleStatusChange = (value) =>
    fetchList({
      ...params,
      pageNum: 1,
      status: value,
    });

  const handleContractFilter = (e) => {
    fetchList({
      ...params,
      pageNum: 1,
      isContract: e.target.checked ? 1 : 0,
    });
  };
  const handleTabChange = (key) => {
    if (key === proposalTypes.PARLIAMENT) {
      removeHash();
      setActiveKey(proposalTypes.PARLIAMENT);
    } else {
      const index = Object.values(keyFromHash).findIndex((ele) => ele === key);
      window.location.hash = Object.keys(keyFromHash)[index];
    }
  };
  useEffect(() => {
    if (!activeKey) return;
    fetchList({
      ...params,
      pageNum: 1,
      proposalType: activeKey,
      status: proposalStatus.ALL,
      isContract: 0,
      search: "",
    });
  }, [activeKey]);
  const changeKey = () => {
    const { hash } = window.location;
    const key = keyFromHash[hash];
    setActiveKey(key || proposalTypes.PARLIAMENT);
    return key || proposalTypes.PARLIAMENT;
  };
  window.addEventListener("hashchange", () => {
    changeKey();
  });
  useEffectOnce(() => {
    changeKey();
  });

  const send = async (id, action) => {
    setLoading({
      ...loading,
      [action]: {
        ...loading[action],
        [id]: true,
      }
    });
    if (params.proposalType === proposalTypes.REFERENDUM) {
      const [proposal] = list.filter((item) => item.proposalId === id);
      setProposalInfo({
        ...proposalInfo,
        tokenSymbol: proposal.organizationInfo.leftOrgInfo.tokenSymbol,
        action,
        proposalId: proposal.proposalId,
        visible: true,
      });
    } else {
      if (!webLoginWallet.accountInfoSync.syncCompleted) {
        showAccountInfoSyncingModal();
        return;
      }

      await sendTransactionWith(
        callContract,
        getContractAddress(params.proposalType),
        action,
        id
      );
    }
    setLoading({
      ...loading,
      [action]: {
        ...loading[action],
        [id]: false,
      }
    });
  };

  async function handleConfirm(action) {
    if (action) {
      if (!webLoginWallet.accountInfoSync.syncCompleted) {
        showAccountInfoSyncingModal();
        return;
      }
      await sendTransactionWith(
        callContract,
        getContractAddress(params.proposalType),
        action,
        proposalInfo.proposalId
      );
    }
    setProposalInfo({
      ...proposalInfo,
      visible: false,
    });
  }

  const handleRelease = async (event) => {
    if (!webLoginWallet.accountInfoSync.syncCompleted) {
      showAccountInfoSyncingModal();
      return;
    }
    const id = event.currentTarget.getAttribute("proposal-id");
    setLoading({
      ...loading,
      Release: {
        ...loading[action],
        [id]: true,
      },
    });
    await sendTransactionWith(
      callContract,
      getContractAddress(params.proposalType),
      "Release",
      id
    );
    setLoading({
      ...loading,
      Release: {
        ...loading[action],
        [id]: false,
      },
    });
  };
  const handleApprove = async (event) => {
    const id = event.currentTarget.getAttribute("proposal-id");
    await send(id, "Approve");
  };
  const handleReject = async (event) => {
    const id = event.currentTarget.getAttribute("proposal-id");
    await send(id, "Reject");
  };
  const handleAbstain = async (event) => {
    const id = event.currentTarget.getAttribute("proposal-id");
    await send(id, "Abstain");
  };

  return (
    <div className="proposal-list">
      <Tabs
        className="proposal-list-tab"
        activeKey={activeKey}
        onChange={handleTabChange}
        animated={false}
      >
        <TabPane
          tab={proposalTypes.PARLIAMENT}
          key={proposalTypes.PARLIAMENT}
        />
        <TabPane
          tab={proposalTypes.ASSOCIATION}
          key={proposalTypes.ASSOCIATION}
        />
        <TabPane
          tab={proposalTypes.REFERENDUM}
          key={proposalTypes.REFERENDUM}
        />
      </Tabs>
      <div className="proposal-list-filter gap-bottom">
        <If condition={params.proposalType === proposalTypes.PARLIAMENT}>
          <Then>
            <Checkbox
              onChange={handleContractFilter}
              className="gap-bottom-large"
            >
              Deploy/Update Contract Proposal
            </Checkbox>
          </Then>
        </If>
        <div className="proposal-list-filter-form">
          <div className="proposal-list-filter-form-select">
            <span className="sub-title gap-right">Status: </span>
            <Select
              defaultValue={proposalStatus.ALL}
              value={params.status}
              onChange={handleStatusChange}
            >
              <Option value={proposalStatus.ALL}>All</Option>
              <Option value={proposalStatus.PENDING}>Pending</Option>
              <Option value={proposalStatus.APPROVED}>Approved</Option>
              <Option value={proposalStatus.RELEASED}>Released</Option>
              <Option value={proposalStatus.EXPIRED}>Expired</Option>
            </Select>
          </div>
          <Search
            className="proposal-list-filter-form-input"
            placeholder="Proposal ID/Contract Address/Proposer"
            defaultValue={params.search}
            allowClear
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={onSearch}
          />
        </div>
      </div>
      <div className="proposal-list-list">
        <Switch>
          <Case
            condition={
              loadingStatus === LOADING_STATUS.LOADING ||
              loadingStatus === LOADING_STATUS.SUCCESS
            }
          >
            <Spin spinning={loadingStatus === LOADING_STATUS.LOADING}>
              <Row type="flex" gutter={16}>
                {list.map((item) => (
                  <Col xs={24} sm={12} key={item.proposalId}>
                    <Proposal
                      bpCount={bpCount}
                      {...item}
                      logStatus={logStatus}
                      currentAccount={currentWallet.address}
                      loading={loading}
                      handleRelease={handleRelease}
                      handleAbstain={handleAbstain}
                      handleApprove={handleApprove}
                      handleReject={handleReject}
                    />
                  </Col>
                ))}
              </Row>
            </Spin>
          </Case>
          <Case condition={loadingStatus === LOADING_STATUS.FAILED}>
            <Result
              status="error"
              title="Error Happened"
              subTitle="Please check your network"
            />
          </Case>
        </Switch>
        <If
          condition={
            loadingStatus === LOADING_STATUS.SUCCESS && list.length === 0
          }
        >
          <Then>
            <Empty />
          </Then>
        </If>
      </div>
      <Pagination
        className="float-right gap-top"
        showQuickJumper
        total={total}
        current={params.pageNum}
        pageSize={params.pageSize}
        hideOnSinglePage
        onChange={onPageNumChange}
        showTotal={Total}
        showSizeChanger={false}
      />
      {proposalInfo.visible ? (
        <ApproveTokenModal
          aelf={aelf}
          {...proposalInfo}
          onCancel={handleConfirm}
          onConfirm={handleConfirm}
          wallet={wallet}
          owner={currentWallet.address}
        />
      ) : null}
    </div>
  );
};

export default React.memo(ProposalList);
