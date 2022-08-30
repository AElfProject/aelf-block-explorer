/**
 * @file proposal item
 * @author atom-yang
 */
import React from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Button, Card, Tag, Divider } from "antd";
import constants, {
  LOG_STATUS,
  ACTIONS_COLOR_MAP,
  organizationInfoPropTypes,
  STATUS_COLOR_MAP,
  CONTRACT_TEXT_MAP,
  PROPOSAL_STATUS_CAPITAL,
} from "../../../common/constants";
import "./index.less";
import VoteChart from "../../../components/VoteChart";
import { PRIMARY_COLOR } from "../../../../../common/constants";

const { proposalTypes, proposalStatus, proposalActions } = constants;

export const ACTIONS_ICON_MAP = {
  [proposalActions.APPROVE]: (
    <CheckCircleOutlined className='gap-right-small' />
  ),
  [proposalActions.REJECT]: <CloseCircleOutlined className='gap-right-small' />,
  [proposalActions.ABSTAIN]: (
    <MinusCircleOutlined className='gap-right-small' />
  ),
};

const Title = (props) => {
  const { status, proposalType, votedStatus, expiredTime } = props;
  const momentExpired = moment(expiredTime);
  const now = moment();
  const threshold = moment().add(3, "days");
  const showExpired =
    status !== proposalStatus.RELEASED &&
    momentExpired.isAfter(now) &&
    momentExpired.isBefore(threshold);
  return (
    <div className='proposal-list-item-title'>
      <span className='gap-right-small'>{proposalType}</span>
      {votedStatus !== "none" ? (
        <Tag color={ACTIONS_COLOR_MAP[votedStatus]}>
          {ACTIONS_ICON_MAP[votedStatus]}
          {votedStatus}
        </Tag>
      ) : null}
      {showExpired ? (
        <span className='warning-text'>{`Expire ${now.to(
          momentExpired
        )}`}</span>
      ) : null}
    </div>
  );
};
Title.propTypes = {
  status: PropTypes.oneOf(Object.values(proposalStatus)).isRequired,
  proposalType: PropTypes.oneOf(Object.values(proposalTypes)).isRequired,
  votedStatus: PropTypes.oneOf(["none", "Approve", "Reject", "Abstain"])
    .isRequired,
  expiredTime: PropTypes.string.isRequired,
};

const Proposal = (props) => {
  const {
    proposalType,
    proposalId,
    expiredTime,
    createAt,
    releasedTime,
    contractAddress,
    contractMethod,
    proposer,
    organizationInfo,
    status,
    approvals,
    rejections,
    abstentions,
    canVote,
    votedStatus,
    bpCount,
    currentAccount,
    logStatus,
    handleRelease,
    handleApprove,
    handleReject,
    handleAbstain,
  } = props;

  const canThisUserVote =
    (status === proposalStatus.PENDING || status === proposalStatus.APPROVED) &&
    votedStatus === "none" &&
    canVote;
  const canRelease =
    logStatus === LOG_STATUS.LOGGED &&
    currentAccount &&
    proposer === currentAccount;
  return (
    <div className='proposal-list-item gap-bottom'>
      <Card
        title={
          <Title
            status={status}
            expiredTime={expiredTime}
            proposalType={proposalType}
            votedStatus={votedStatus}
          />
        }
      >
        <div className='proposal-list-item-id'>
          <div className='gap-right-large'>
            <Link
              to={`/proposal/proposalsDetail/${proposalId}`}
              className='text-ellipsis'
            >
              {proposalId}
            </Link>
            {CONTRACT_TEXT_MAP[contractMethod] ? (
              <Tag color={PRIMARY_COLOR}>
                {CONTRACT_TEXT_MAP[contractMethod]}
              </Tag>
            ) : null}
          </div>
          <div className='proposal-list-item-id-status'>
            <Tag color={STATUS_COLOR_MAP[status]}>
              {PROPOSAL_STATUS_CAPITAL[status]}
            </Tag>
            {status === proposalStatus.APPROVED && canRelease ? (
              // eslint-disable-next-line max-len
              <Button
                proposal-id={proposalId}
                type='link'
                size='small'
                onClick={handleRelease}
              >
                Release&gt;
              </Button>
            ) : null}
          </div>
        </div>
        <Divider />
        <div className='proposal-list-item-info'>
          <div className='proposal-list-item-info-item'>
            <span className='sub-title gap-right'>Proposal Expires:</span>
            <span className='text-ellipsis'>
              {moment(expiredTime).format("YYYY/MM/DD HH:mm:ss")}
            </span>
          </div>
          <div className='proposal-list-item-info-item'>
            <span className='sub-title gap-right'>Contract:</span>
            <span className='text-ellipsis'>{contractAddress}</span>
          </div>
          <div className='proposal-list-item-info-item'>
            <span className='sub-title gap-right'>Contract Method:</span>
            <span className='text-ellipsis'>{contractMethod}</span>
          </div>
        </div>
        <Divider />
        <VoteChart
          proposalType={proposalType}
          approvals={approvals}
          rejections={rejections}
          abstentions={abstentions}
          bpCount={bpCount}
          organizationInfo={organizationInfo}
        />
        <Divider />
        <div className='proposal-list-item-actions'>
          <div className='proposal-list-item-buttons'>
            <Button
              disabled={!canThisUserVote}
              className='approve-color gap-right'
              shape='round'
              proposal-id={proposalId}
              onClick={handleApprove}
            >
              Approve
            </Button>
            <Button
              type='danger'
              shape='round'
              disabled={!canThisUserVote}
              proposal-id={proposalId}
              onClick={handleReject}
            >
              &nbsp;Reject&nbsp;
            </Button>
          </div>
          <Button
            className='proposal-list-item-abstain'
            type='link'
            disabled={!canThisUserVote}
            onClick={handleAbstain}
            proposal-id={proposalId}
          >
            Abstain
          </Button>
        </div>
      </Card>
    </div>
  );
};

/* eslint-disable react/no-unused-prop-types */
export const proposalPropTypes = {
  proposalType: PropTypes.oneOf(Object.values(proposalTypes)).isRequired,
  proposalId: PropTypes.string.isRequired,
  expiredTime: PropTypes.string.isRequired,
  createTxId: PropTypes.string.isRequired,
  contractAddress: PropTypes.string.isRequired,
  contractMethod: PropTypes.string.isRequired,
  proposer: PropTypes.string.isRequired,
  organizationInfo: PropTypes.shape(organizationInfoPropTypes).isRequired,
  isContractDeployed: PropTypes.bool.isRequired,
  createdBy: PropTypes.oneOf(["USER", "SYSTEM_CONTRACT"]).isRequired,
  releasedTxId: PropTypes.string.isRequired,
  releasedTime: PropTypes.string.isRequired,
  createAt: PropTypes.string.isRequired,
  status: PropTypes.oneOf(Object.values(proposalStatus)).isRequired,
  approvals: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  rejections: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  abstentions: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    .isRequired,
  canVote: PropTypes.bool.isRequired,
  votedStatus: PropTypes.oneOf(["none", "Approve", "Reject", "Abstain"])
    .isRequired,
  logStatus: PropTypes.oneOf(Object.values(LOG_STATUS)).isRequired,
  bpCount: PropTypes.number.isRequired,
  handleRelease: PropTypes.func.isRequired,
  handleApprove: PropTypes.func.isRequired,
  handleReject: PropTypes.func.isRequired,
  handleAbstain: PropTypes.func.isRequired,
  currentAccount: PropTypes.string,
};

Proposal.propTypes = proposalPropTypes;
Proposal.defaultProps = {
  currentAccount: "",
};

export default Proposal;
