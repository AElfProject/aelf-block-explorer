/**
 * @file organization item
 * @author atom-yang
 */
import React, { useMemo } from "react";
import roundTo from "round-to";
import { Switch, Case } from "react-if";
import moment from "moment";
import PropTypes from "prop-types";
import { EditOutlined } from "@ant-design/icons";
import { Card, Row, Select, Col, Divider } from "antd";
import config from "../../../../../common/config";
import Circle from "../../../components/Circle";
import constants, {
  LOG_STATUS,
  organizationInfoPropTypes,
} from "../../../common/constants";
import "./index.less";
import { isPhoneCheck } from "../../../../../common/utils";
import { PRIMARY_COLOR } from "../../../../../common/constants";
import addressFormat from "../../../../../utils/addressFormat";

const { viewer } = config;

const { Option } = Select;

const { proposalTypes, proposalActions } = constants;

const Title = (props) => {
  const { proposalType } = props;
  return (
    <div className="organization-list-item-title">
      <span className="gap-right-small">{proposalType} Organization</span>
    </div>
  );
};
Title.propTypes = {
  proposalType: PropTypes.oneOf(Object.values(proposalTypes)).isRequired,
};

function getRate(number, precision = 2) {
  return roundTo(number * 100, precision);
}

export function getCircleValues(
  proposalType,
  releaseThreshold,
  leftOrgInfo,
  bpCount = 1
) {
  const abstractVoteTotal = 10000;
  const {
    minimalApprovalThreshold,
    maximalRejectionThreshold,
    maximalAbstentionThreshold,
    minimalVoteThreshold,
  } = releaseThreshold;
  let total;
  let coef = 1;
  let precision = 0;
  if (proposalType === proposalType.ASSOCIATION) {
    const {
      organizationMemberList: { organizationMembers },
    } = leftOrgInfo;
    total = organizationMembers.length;
  } else if (proposalType === proposalTypes.PARLIAMENT) {
    coef = bpCount / abstractVoteTotal;
    total = abstractVoteTotal;
  } else {
    precision = 8;
    total = minimalVoteThreshold;
  }
  const result = {
    [proposalActions.APPROVE]: {
      value: minimalApprovalThreshold,
      maxValue: total,
      num: roundTo.up(minimalApprovalThreshold * coef, precision),
      rate: `${getRate(minimalApprovalThreshold / total)}%`,
    },
    [proposalActions.REJECT]: {
      value: maximalRejectionThreshold,
      maxValue: total,
      num: roundTo(maximalRejectionThreshold * coef, precision),
      rate: `${getRate(maximalRejectionThreshold / total)}%`,
    },
    [proposalActions.ABSTAIN]: {
      value: maximalAbstentionThreshold,
      maxValue: total,
      num: roundTo(maximalAbstentionThreshold * coef, precision),
      rate: `${getRate(maximalAbstentionThreshold / total)}%`,
    },
    Total: {
      value: minimalVoteThreshold,
      maxValue: total,
      num: roundTo.up(minimalVoteThreshold * coef, precision),
      rate: `${getRate(minimalVoteThreshold / total)}%`,
    },
  };
  return result;
}

function isProposer(
  logStatus,
  user,
  proposalType,
  leftOrgInfo,
  bpList,
  parliamentProposerList
) {
  if (logStatus !== LOG_STATUS.LOGGED) {
    return false;
  }
  const { proposerAuthorityRequired, proposerWhiteList = {} } = leftOrgInfo;
  let { proposers = [] } = proposerWhiteList;
  if (proposalType === proposalTypes.PARLIAMENT) {
    if (proposerAuthorityRequired === true) {
      proposers = [...bpList, ...parliamentProposerList];
      proposers = [...new Set(proposers)];
      return proposers.indexOf(user) > -1;
    }
    return true;
  }
  return proposers.indexOf(user) > -1;
}

export function getOrganizationLeftInfo(
  proposalType,
  leftOrgInfo,
  bpList,
  parliamentProposerList
) {
  const {
    tokenSymbol,
    proposerAuthorityRequired,
    proposerWhiteList = {},
    organizationMemberList = {},
  } = leftOrgInfo;
  let { proposers = [] } = proposerWhiteList;
  let { organizationMembers = [] } = organizationMemberList;
  if (proposalType === proposalTypes.PARLIAMENT) {
    organizationMembers = [...bpList];
    if (proposerAuthorityRequired === true) {
      proposers = [...bpList, ...parliamentProposerList];
      proposers = [...new Set(proposers)];
    }
  }
  const proposerList =
    proposers.length > 0 ? (
      // eslint-disable-next-line max-len
      <Select size="small" defaultValue={proposers[0]}>
        {proposers.map((v) => (
          <Option key={v} value={v}>{`ELF_${v}_${viewer.chainId}`}</Option>
        ))}
      </Select>
    ) : (
      "None"
    );
  const members =
    organizationMembers.length > 0 ? (
      // eslint-disable-next-line max-len
      <Select size="small" defaultValue={organizationMembers[0]}>
        {organizationMembers.map((v) => (
          <Option key={v} value={v}>{`ELF_${v}_${viewer.chainId}`}</Option>
        ))}
      </Select>
    ) : (
      "None"
    );
  return (
    <Switch>
      <Case condition={proposalType === proposalTypes.REFERENDUM}>
        <>
          <div className="gap-bottom-small card-list-desc-item">
            <span className="sub-title">Token:</span>
            <span>{tokenSymbol}</span>
          </div>
          <div className="gap-bottom-small card-list-desc-item">
            <span className="sub-title">Members:</span>
            <span>All Users</span>
          </div>
          <div className="card-list-desc-item">
            <span className="sub-title">Proposer White List:</span>
            <span>{proposerList}</span>
          </div>
        </>
      </Case>
      <Case condition={proposalType === proposalTypes.PARLIAMENT}>
        <>
          <div className="gap-bottom-small card-list-desc-item">
            <span className="sub-title">Members:</span>
            <span>{members}</span>
          </div>
          <div className="card-list-desc-item">
            <span className="sub-title">Proposer White List:</span>
            <span>
              {proposerAuthorityRequired === false ? "All Users" : proposerList}
            </span>
          </div>
        </>
      </Case>
      <Case condition={proposalType === proposalTypes.ASSOCIATION}>
        <>
          <div className="gap-bottom-small card-list-desc-item">
            <span className="sub-title">Members:</span>
            <span>{members}</span>
          </div>
          <div className="card-list-desc-item">
            <span className="sub-title">Proposer White List:</span>
            <span>{proposerList}</span>
          </div>
        </>
      </Case>
    </Switch>
  );
}

const Organization = (props) => {
  const {
    proposalType,
    releaseThreshold,
    leftOrgInfo,
    orgAddress,
    creator,
    updatedAt,
    logStatus,
    bpList,
    editOrganization,
    parliamentProposerList,
    currentWallet,
  } = props;
  const votesData = useMemo(
    () =>
      getCircleValues(
        proposalType,
        releaseThreshold,
        leftOrgInfo,
        bpList.length
      ),
    [proposalType, releaseThreshold, leftOrgInfo]
  );
  console.log("votesData", votesData);
  const leftOrg = useMemo(
    () =>
      getOrganizationLeftInfo(
        proposalType,
        leftOrgInfo,
        bpList,
        parliamentProposerList
      ),
    [leftOrgInfo, bpList, parliamentProposerList]
  );
  // eslint-disable-next-line max-len
  const canEdit = useMemo(
    () =>
      isProposer(
        logStatus,
        currentWallet.address,
        proposalType,
        leftOrgInfo,
        bpList,
        parliamentProposerList
      ),
    [logStatus, currentWallet]
  );
  const handleEdit = () => {
    editOrganization(orgAddress);
  };

  if (isPhoneCheck()) {
    return (
      <div className="organization-list-item gap-bottom">
        <Card title={<Title proposalType={proposalType} />}>
          <div className="organization-list-item-id">
            <div className="gap-right-large text-ellipsis">
              {addressFormat(orgAddress)}
            </div>
            {canEdit ? (
              <EditOutlined color={PRIMARY_COLOR} onClick={handleEdit} />
            ) : null}
          </div>
          <Divider />
          <div className="organization-list-item-info">
            <div className="organization-list-item-info-item">
              <span className="sub-title gap-right">Author:</span>
              <span className="text-ellipsis">
                <a
                  href={`${viewer.addressUrl}/${addressFormat(creator)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {addressFormat(creator)}
                </a>
              </span>
            </div>
            <div className="organization-list-item-info-item">
              <span className="sub-title gap-right">Update Time:</span>
              <span className="text-ellipsis">
                {moment(updatedAt).format("YYYY/MM/DD HH:mm:ss")}
              </span>
            </div>
          </div>
          <Divider />
          <div className="organization-list-item-votes">
            <p>Voting Data: Votes (Votes / Minimum Votes)</p>
            <Row gutter={16} className="organization-list-item-vote-chart">
              <Col span={8} offset={2}>
                <Circle
                  className="organization-list-item-vote-chart-circle"
                  type={proposalActions.APPROVE}
                  {...votesData[proposalActions.APPROVE]}
                />
              </Col>
              <Col span={8} offset={4}>
                <Circle
                  className="organization-list-item-vote-chart-circle"
                  type={proposalActions.REJECT}
                  {...votesData[proposalActions.REJECT]}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="organization-list-item-vote-desc text-center">
                  <div className="text-ellipsis" title="Approved Votes">
                    Approved Votes
                  </div>
                  <div
                    className="text-ellipsis"
                    title={`${votesData[proposalActions.APPROVE].num}(${
                      votesData[proposalActions.APPROVE].rate
                    })`}
                  >
                    <span className="sub-title gap-right-small">
                      {votesData[proposalActions.APPROVE].num}
                    </span>
                    <span>({votesData[proposalActions.APPROVE].rate})</span>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="organization-list-item-vote-desc text-center">
                  <div className="text-ellipsis" title="Rejected Votes">
                    Rejected Votes
                  </div>
                  <div
                    className="text-ellipsis"
                    title={`${votesData[proposalActions.REJECT].num}(${
                      votesData[proposalActions.REJECT].rate
                    })`}
                  >
                    <span className="sub-title gap-right-small">
                      {votesData[proposalActions.REJECT].num}
                    </span>
                    <span>({votesData[proposalActions.REJECT].rate})</span>
                  </div>
                </div>
              </Col>
            </Row>

            <Row gutter={16} className="organization-list-item-vote-chart">
              <Col span={8} offset={2}>
                <Circle
                  className="organization-list-item-vote-chart-circle"
                  type={proposalActions.ABSTAIN}
                  {...votesData[proposalActions.ABSTAIN]}
                />
              </Col>
              <Col span={8} offset={4}>
                <Circle
                  className="organization-list-item-vote-chart-circle"
                  type="Total"
                  {...votesData.Total}
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <div className="organization-list-item-vote-desc text-center">
                  <div className="text-ellipsis" title="Abstained Votes">
                    Abstained Votes
                  </div>
                  <div
                    className="text-ellipsis"
                    title={`${votesData[proposalActions.ABSTAIN].num}(${
                      votesData[proposalActions.ABSTAIN].rate
                    })`}
                  >
                    <span className="sub-title gap-right-small">
                      {votesData[proposalActions.ABSTAIN].num}
                    </span>
                    <span>({votesData[proposalActions.ABSTAIN].rate})</span>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div className="organization-list-item-vote-desc text-center">
                  <div className="text-ellipsis" title="Total Votes">
                    Total Votes
                  </div>
                  <div
                    className="text-ellipsis"
                    title={`${votesData.Total.num}(${votesData.Total.rate})`}
                  >
                    <span className="sub-title gap-right-small">
                      {votesData.Total.num}
                    </span>
                    <span>({votesData.Total.rate})</span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <Divider />
          <div className="organization-list-item-extra">{leftOrg}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="organization-list-item gap-bottom">
      <Card title={<Title proposalType={proposalType} />}>
        <div className="organization-list-item-id">
          <div className="gap-right-large text-ellipsis">
            {addressFormat(orgAddress)}
          </div>
          {canEdit ? (
            <EditOutlined color={PRIMARY_COLOR} onClick={handleEdit} />
          ) : null}
        </div>
        <Divider />
        <div className="organization-list-item-info">
          <div className="organization-list-item-info-item">
            <span className="sub-title gap-right">Author:</span>
            <span className="text-ellipsis">
              <a
                href={`${viewer.addressUrl}/${addressFormat(creator)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {addressFormat(creator)}
              </a>
            </span>
          </div>
          <div className="organization-list-item-info-item">
            <span className="sub-title gap-right">Update Time:</span>
            <span className="text-ellipsis">
              {moment(updatedAt).format("YYYY/MM/DD HH:mm:ss")}
            </span>
          </div>
        </div>
        <Divider />
        <div className="organization-list-item-votes">
          <p>Voting Data: Votes (Votes / Minimum Votes)</p>
          <Row gutter={16} className="organization-list-item-vote-chart">
            <Col span={4} offset={1}>
              <Circle
                className="organization-list-item-vote-chart-circle"
                type={proposalActions.APPROVE}
                {...votesData[proposalActions.APPROVE]}
              />
            </Col>
            <Col span={4} offset={2}>
              <Circle
                className="organization-list-item-vote-chart-circle"
                type={proposalActions.REJECT}
                {...votesData[proposalActions.REJECT]}
              />
            </Col>
            <Col span={4} offset={2}>
              <Circle
                className="organization-list-item-vote-chart-circle"
                type={proposalActions.ABSTAIN}
                {...votesData[proposalActions.ABSTAIN]}
              />
            </Col>
            <Col span={4} offset={2}>
              <Circle
                className="organization-list-item-vote-chart-circle"
                type="Total"
                {...votesData.Total}
              />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={6}>
              <div className="organization-list-item-vote-desc text-center">
                <div className="text-ellipsis" title="Approved Votes">
                  Approved Votes
                </div>
                <div
                  className="text-ellipsis"
                  title={`${votesData[proposalActions.APPROVE].num}(${
                    votesData[proposalActions.APPROVE].rate
                  })`}
                >
                  <span className="sub-title gap-right-small">
                    {votesData[proposalActions.APPROVE].num}
                  </span>
                  <span>({votesData[proposalActions.APPROVE].rate})</span>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className="organization-list-item-vote-desc text-center">
                <div className="text-ellipsis" title="Rejected Votes">
                  Rejected Votes
                </div>
                <div
                  className="text-ellipsis"
                  title={`${votesData[proposalActions.REJECT].num}(${
                    votesData[proposalActions.REJECT].rate
                  })`}
                >
                  <span className="sub-title gap-right-small">
                    {votesData[proposalActions.REJECT].num}
                  </span>
                  <span>({votesData[proposalActions.REJECT].rate})</span>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className="organization-list-item-vote-desc text-center">
                <div className="text-ellipsis" title="Abstained Votes">
                  Abstained Votes
                </div>
                <div
                  className="text-ellipsis"
                  title={`${votesData[proposalActions.ABSTAIN].num}(${
                    votesData[proposalActions.ABSTAIN].rate
                  })`}
                >
                  <span className="sub-title gap-right-small">
                    {votesData[proposalActions.ABSTAIN].num}
                  </span>
                  <span>({votesData[proposalActions.ABSTAIN].rate})</span>
                </div>
              </div>
            </Col>
            <Col span={6}>
              <div className="organization-list-item-vote-desc text-center">
                <div className="text-ellipsis" title="Total Votes">
                  Total Votes
                </div>
                <div
                  className="text-ellipsis"
                  title={`${votesData.Total.num}(${votesData.Total.rate})`}
                >
                  <span className="sub-title gap-right-small">
                    {votesData.Total.num}
                  </span>
                  <span>({votesData.Total.rate})</span>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <Divider />
        <div className="organization-list-item-extra">{leftOrg}</div>
      </Card>
    </div>
  );
};

Organization.propTypes = {
  ...organizationInfoPropTypes,
  logStatus: PropTypes.oneOf(Object.values(LOG_STATUS)).isRequired,
  bpList: PropTypes.arrayOf(PropTypes.string).isRequired,
  editOrganization: PropTypes.func.isRequired,
  parliamentProposerList: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentWallet: PropTypes.shape({
    address: PropTypes.string,
    publicKey: PropTypes.string,
  }).isRequired,
};

export default Organization;
