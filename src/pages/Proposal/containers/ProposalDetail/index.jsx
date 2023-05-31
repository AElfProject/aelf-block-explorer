/* eslint-disable react/jsx-no-bind */
/**
 * @file proposal detail
 * @author atom-yang
 */
// eslint-disable-next-line no-use-before-define
import React, { useState, useEffect, useMemo } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import {
  useParams,
  useNavigate,
  Redirect,
  useLocation,
} from "react-router-dom";
import {
  Tag,
  Button,
  Divider,
  PageHeader,
  Skeleton,
  Result,
  Row,
  Col,
  Tabs,
  Typography,
} from "antd";
import { useSelector } from "react-redux";
import { useWebLogin } from "aelf-web-login";
import { ACTIONS_ICON_MAP } from "../ProposalList/Proposal";
import constants, {
  ACTIONS_COLOR_MAP,
  API_PATH,
  CONTRACT_TEXT_MAP,
  LOADING_STATUS,
  LOG_STATUS,
  STATUS_COLOR_MAP,
  PROPOSAL_STATUS_CAPITAL,
} from "../../../../redux/common/constants";
import { request } from "../../../../common/request";
import VoteData from "./VoteData";
import VoteDetail from "./VoteDetail";
import OrganizationCard from "./OrganizationCard";
import ContractDetail from "./ContractDetail";
import config from "../../../../common/config";
import "./index.less";
import { getContractAddress, sendTransactionWith } from "../../../../redux/common/utils";
import ApproveTokenModal from "../../components/ApproveTokenModal";
import {
  getBPCount,
  isPhoneCheck,
  sendHeight,
  validateURL,
} from "../../../../common/utils";
import { PRIMARY_COLOR } from "../../../../common/constants";
import removeHash from "../../../../utils/removeHash";
import addressFormat from "../../../../utils/addressFormat";
import { NETWORK_TYPE } from '../../../../../config/config';

const { viewer } = config;
const { Title } = Typography;

const { TabPane } = Tabs;

const { proposalTypes, proposalStatus } = constants;

async function getData(currentWallet, proposalId) {
  return request(
    API_PATH.GET_PROPOSAL_INFO,
    {
      address: currentWallet.address,
      proposalId,
    },
    { method: "GET" }
  );
}

function CountDown(props) {
  const { time, status } = props;
  if (!time) {
    return null;
  }
  const now = moment();
  const threshold = moment().add(3, "days");
  const expired = moment(time);
  const show =
    status !== proposalStatus.RELEASED &&
    expired.isAfter(now) &&
    expired.isBefore(threshold);
  return show ? (
    <span className="warning-text">{`Expire ${now.to(expired)}`}</span>
  ) : null;
}

CountDown.propTypes = {
  time: PropTypes.string,
  status: PropTypes.oneOf(Object.values(proposalStatus)).isRequired,
};

CountDown.defaultProps = {
  time: "",
};

function Extra(props) {
  const { status, logStatus, currentWallet, proposer, handleRelease } = props;
  const canRelease =
    logStatus === LOG_STATUS.LOGGED &&
    currentWallet &&
    proposer === currentWallet.address;
  return (
    <div className="proposal-list-item-id-status">
      <Tag color={STATUS_COLOR_MAP[status]}>
        {PROPOSAL_STATUS_CAPITAL[status]}
      </Tag>
      {status === proposalStatus.APPROVED && canRelease ? (
        // eslint-disable-next-line max-len
        <Button type="link" size="small" onClick={handleRelease}>
          Release&gt;
        </Button>
      ) : null}
    </div>
  );
}

Extra.propTypes = {
  currentWallet: PropTypes.shape({
    address: PropTypes.string,
    publicKey: PropTypes.string,
  }).isRequired,
  status: PropTypes.oneOf(Object.values(proposalStatus)).isRequired,
  logStatus: PropTypes.oneOf(Object.values(LOG_STATUS)).isRequired,
  proposer: PropTypes.string.isRequired,
  handleRelease: PropTypes.func.isRequired,
};

const ProposalDetail = () => {
  const { proposalId = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const common = useSelector((state) => state.common);
  const [visible, setVisible] = useState(false);
  const [activeKey, setActiveKey] = useState("proposal");
  const { logStatus, aelf, wallet, currentWallet, isALLSettle } = common;
  const [info, setInfo] = useState({
    proposal: {},
    organization: {},
    bpList: [],
    parliamentProposerList: [],
    tab: "proposal",
    loadingStatus: LOADING_STATUS.LOADING,
  });
  if (!proposalId) {
    return <Redirect to="/proposals" />;
  }
  useEffect(() => {
    if (location.hash === "#voting") {
      setActiveKey("vote");
    } else {
      setActiveKey("proposal");
    }
  }, [proposalId]);
  useEffect(() => {
    getData(currentWallet, proposalId)
      .then((result) => {
        setInfo({
          ...info,
          bpList: result.bpList,
          proposal: result.proposal,
          organization: result.organization,
          parliamentProposerList: result.parliamentProposerList,
          loadingStatus: LOADING_STATUS.SUCCESS,
        });
        sendHeight(800);
      })
      .catch((e) => {
        console.error(e);
        setInfo({
          ...info,
          loadingStatus: LOADING_STATUS.FAILED,
        });
      });
  }, [isALLSettle, proposalId, logStatus]);

  const {
    createAt,
    proposer,
    contractAddress,
    contractMethod,
    contractParams,
    expiredTime,
    approvals,
    rejections,
    abstentions,
    status,
    releasedTime,
    proposalType,
    canVote,
    votedStatus,
    createdBy,
    leftInfo,
  } = info.proposal;

  const { leftOrgInfo = {} } = info.organization;

  const { callContract } = useWebLogin();

  const bpCountNumber = useMemo(() => {
    if (NETWORK_TYPE === 'MAIN') {
      return getBPCount(status, expiredTime, releasedTime)
    }
    return info.bpList.length;
    
  }, [info.bpList, status, expiredTime, releasedTime, NETWORK_TYPE]);

  const send = async (action) => {
    if (proposalType === proposalTypes.REFERENDUM) {
      setVisible(action);
    } else {
      await sendTransactionWith(
        callContract,
        getContractAddress(proposalType),
        action,
        proposalId
      );
    }
  };

  function goBack() {
    navigate(-1);
  }

  async function handleApprove() {
    await send("Approve");
  }

  async function handleReject() {
    await send("Reject");
  }

  async function handleAbstain() {
    await send("Abstain");
  }

  async function handleRelease() {
    await send("Release");
    // await sendTransactionWith(
    //   callContract,
    //   getContractAddress(proposalType),
    //   "Release",
    //   proposalId
    // );
  }

  async function handleConfirm(action) {
    if (action) {
      await sendTransactionWith(
        callContract,
        getContractAddress(proposalType),
        action,
        proposalId
      );
    }
    setVisible(false);
  }

  const changeTab = (key) => {
    if (key === "proposal") {
      removeHash();
      setActiveKey("proposal");
    } else {
      window.location.hash = "voting";
    }
  };

  window.addEventListener("hashchange", () => {
    if (location.hash === "#voting") {
      setActiveKey("vote");
    } else {
      setActiveKey("proposal");
    }
  });

  return (
    <div className="proposal-detail">
      {info.loadingStatus === LOADING_STATUS.LOADING ? <Skeleton /> : null}
      {info.loadingStatus === LOADING_STATUS.SUCCESS ? (
        <>
          <PageHeader
            onBack={navigate.length > 1 ? goBack : null}
            title="Proposal Detail"
            subTitle={<CountDown time={expiredTime} status={status} />}
            tags={
              votedStatus && votedStatus !== "none" ? (
                <Tag color={ACTIONS_COLOR_MAP[votedStatus]}>
                  {ACTIONS_ICON_MAP[votedStatus]}
                  {votedStatus}
                </Tag>
              ) : null
            }
            extra={
              <Extra
                {...info.proposal}
                currentWallet={currentWallet}
                logStatus={logStatus}
                handleRelease={handleRelease}
              />
            }
          />
          <Divider className="proposal-detail-header-divider" />
          {isPhoneCheck() ? (
            <Title level={4}>
              Proposal ID:
              {proposalId}
            </Title>
          ) : (
            <Title level={3} ellipsis>
              Proposal ID:
              {proposalId}
            </Title>
          )}
          <div className="proposal-detail-tag gap-bottom">
            <Tag color={PRIMARY_COLOR} className="gap-right">
              {proposalType}
            </Tag>
            {CONTRACT_TEXT_MAP[contractMethod] ? (
              <Tag color={PRIMARY_COLOR}>
                {CONTRACT_TEXT_MAP[contractMethod]}
              </Tag>
            ) : null}
          </div>
          <div className="proposal-detail-desc-list">
            <Row gutter={48}>
              <Col sm={12} xs={24} className="detail-flex">
                <span className="sub-title gap-right">
                  Application Submitted:
                </span>
                <span className="text-ellipsis">
                  {moment(createAt).format("YYYY/MM/DD HH:mm:ss")}
                </span>
              </Col>
              <Col sm={12} xs={24} className="detail-flex">
                <span className="sub-title gap-right">Proposal Expires:</span>
                <span className="text-ellipsis">
                  {moment(expiredTime).format("YYYY/MM/DD HH:mm:ss")}
                </span>
              </Col>
              <Col sm={12} xs={24} className="detail-flex">
                <span className="sub-title gap-right">Proposer:</span>
                <span className="text-ellipsis">
                  <a
                    href={`${viewer.addressUrl}/${addressFormat(proposer)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={`ELF_${proposer}_${viewer.chainId}`}
                  >
                    {`ELF_${proposer}_${viewer.chainId}`}
                  </a>
                </span>
              </Col>
              <Col sm={12} xs={24} className="detail-flex">
                <span className="sub-title gap-right">URL:</span>
                <span className="text-ellipsis">
                  {validateURL(leftInfo.proposalDescriptionUrl || "") ? (
                    <a
                      href={leftInfo.proposalDescriptionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={leftInfo.proposalDescriptionUrl}
                    >
                      {leftInfo.proposalDescriptionUrl}
                    </a>
                  ) : (
                    "-"
                  )}
                </span>
              </Col>
              {status === proposalStatus.RELEASED ? (
                <Col sm={12} xs={24} className="detail-flex">
                  <span className="sub-title gap-right">
                    Proposal Released:
                  </span>
                  <span className="text-ellipsis">
                    {moment(releasedTime).format("YYYY/MM/DD HH:mm:ss")}
                  </span>
                </Col>
              ) : null}
            </Row>
          </div>
          <Divider />
          <Tabs
            type="card"
            activeKey={activeKey}
            onTabClick={(key) => changeTab(key)}
          >
            <TabPane tab="Proposal Details" key="proposal">
              <>
                <VoteData
                  className="gap-top-large"
                  proposalType={proposalType}
                  expiredTime={expiredTime}
                  status={status}
                  approvals={approvals}
                  rejections={rejections}
                  abstentions={abstentions}
                  canVote={canVote}
                  votedStatus={votedStatus}
                  bpCount={bpCountNumber}
                  handleApprove={handleApprove}
                  handleReject={handleReject}
                  handleAbstain={handleAbstain}
                  organization={info.organization}
                />
                <OrganizationCard
                  className="gap-top-large"
                  bpList={info.bpList}
                  bpCount={bpCountNumber}
                  parliamentProposerList={info.parliamentProposerList}
                  {...info.organization}
                />
                <ContractDetail
                  className="gap-top-large"
                  aelf={aelf}
                  contractAddress={contractAddress}
                  contractMethod={contractMethod}
                  contractParams={contractParams}
                  createdBy={createdBy}
                />
              </>
            </TabPane>
            <TabPane tab="Voting Details" key="vote">
              <VoteDetail
                proposalType={proposalType}
                proposalId={proposalId}
                logStatus={logStatus}
                expiredTime={expiredTime}
                status={status}
                currentWallet={currentWallet}
                wallet={wallet}
                symbol={leftOrgInfo.tokenSymbol || "ELF"}
              />
            </TabPane>
          </Tabs>
          {visible ? (
            <ApproveTokenModal
              aelf={aelf}
              {...info.proposal}
              action={visible}
              tokenSymbol={leftOrgInfo.tokenSymbol || "ELF"}
              onCancel={handleConfirm}
              onConfirm={handleConfirm}
              wallet={wallet}
              proposalId={proposalId}
              owner={currentWallet.address}
              visible={!!visible}
            />
          ) : null}
        </>
      ) : null}
      {info.loadingStatus === LOADING_STATUS.FAILED ? (
        <Result
          status="error"
          title="Error Happened"
          subTitle="Please check your network"
        />
      ) : null}
    </div>
  );
};

export default ProposalDetail;
