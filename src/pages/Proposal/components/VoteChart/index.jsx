/**
 * @file vote chart
 * @author atom-yang
 */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'antd';
import roundTo from 'round-to';
import Circle from '../Circle';
import constants, { organizationInfoPropTypes } from '../../common/constants';
import './index.less';
import { isPhoneCheck } from '../../../../common/utils';

const {
  proposalActions,
  proposalTypes,
} = constants;

function getRate(number, decimal = 2) {
  return roundTo(number * 100, decimal);
}

function getCircleValues(proposalType, {
  approvals,
  rejections,
  abstentions,
}, organization, bpCount = 1) {
  const abstractVoteTotal = 10000;
  const {
    releaseThreshold,
    leftOrgInfo,
  } = organization;
  const {
    minimalApprovalThreshold,
    maximalRejectionThreshold,
    maximalAbstentionThreshold,
    minimalVoteThreshold,
  } = releaseThreshold;
  if (proposalType === proposalTypes.PARLIAMENT) {
    return {
      [proposalActions.APPROVE]: {
        value: (approvals / bpCount) * abstractVoteTotal,
        threshold: minimalApprovalThreshold,
        maxValue: abstractVoteTotal,
        rate: `${getRate(approvals / bpCount)}%`,
      },
      [proposalActions.REJECT]: {
        value: (rejections / bpCount) * abstractVoteTotal,
        threshold: maximalRejectionThreshold,
        maxValue: abstractVoteTotal,
        rate: `${getRate(rejections / bpCount)}%`,
      },
      [proposalActions.ABSTAIN]: {
        value: (abstentions / bpCount) * abstractVoteTotal,
        threshold: maximalAbstentionThreshold,
        maxValue: abstractVoteTotal,
        rate: `${getRate(abstentions / bpCount)}%`,
      },
      Total: {
        value: ((approvals + rejections + abstentions) / bpCount) * abstractVoteTotal,
        threshold: minimalVoteThreshold,
        maxValue: abstractVoteTotal,
        rate: `${getRate((approvals + rejections + abstentions) / bpCount)}%`,
      },
    };
  }
  let total;
  if (proposalType === proposalType.ASSOCIATION) {
    const {
      organizationMemberList: {
        organizationMembers,
      },
    } = leftOrgInfo;
    total = organizationMembers.length;
  } else {
    total = minimalVoteThreshold;
  }
  const result = {
    [proposalActions.APPROVE]: {
      value: approvals,
      threshold: minimalApprovalThreshold,
      maxValue: total,
      rate: `${getRate(approvals / total)}%`,
    },
    [proposalActions.REJECT]: {
      value: rejections,
      threshold: maximalRejectionThreshold,
      maxValue: total,
      rate: `${getRate(rejections / total)}%`,
    },
    [proposalActions.ABSTAIN]: {
      value: abstentions,
      threshold: maximalAbstentionThreshold,
      maxValue: total,
      rate: `${getRate(abstentions / total)}%`,
    },
    Total: {
      value: (approvals + rejections + abstentions),
      threshold: minimalVoteThreshold,
      maxValue: total,
      rate: `${getRate((approvals + rejections + abstentions) / total)}%`,
    },
  };
  return result;
}

const VoteChart = (props) => {
  const {
    organizationInfo,
    bpCount,
    proposalType,
    approvals,
    rejections,
    abstentions,
  } = props;
  const votesData = useMemo(() => getCircleValues(proposalType, {
    approvals,
    rejections,
    abstentions,
  }, organizationInfo, bpCount), [
    proposalType,
    organizationInfo,
    bpCount,
  ]);

  if (isPhoneCheck()) {
    return (
      <div className="proposal-vote">
        <p>Voting Data: Votes (Votes / Minimum Votes)</p>
        <Row
          gutter={16}
          className="proposal-vote-chart"
        >
          <Col span={8} offset={2}>
            <Circle
              className="proposal-vote-chart-circle"
              isInProgress
              type={proposalActions.APPROVE}
              {...votesData[proposalActions.APPROVE]}
            />
          </Col>
          <Col span={8} offset={4}>
            <Circle
              className="proposal-vote-chart-circle"
              isInProgress
              type={proposalActions.REJECT}
              {...votesData[proposalActions.REJECT]}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <div className="proposal-vote-desc text-center">
              <div className="text-ellipsis" title="Approved Votes">Approved Votes</div>
              <div className="text-ellipsis" title={`${approvals}(${votesData[proposalActions.APPROVE].rate})`}>
                <span className="sub-title gap-right-small">{approvals}</span>
                <span>
                  (
                  {votesData[proposalActions.APPROVE].rate}
                  )
                </span>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="proposal-vote-desc text-center">
              <div className="text-ellipsis" title="Rejected Votes">Rejected Votes</div>
              <div className="text-ellipsis" title={`${rejections}(${votesData[proposalActions.REJECT].rate})`}>
                <span className="sub-title gap-right-small">{rejections}</span>
                <span>
                  (
                  {votesData[proposalActions.REJECT].rate}
                  )
                </span>
              </div>
            </div>
          </Col>
        </Row>

        <Row
          gutter={16}
          className="proposal-vote-chart"
        >
          <Col span={8} offset={2}>
            <Circle
              className="proposal-vote-chart-circle"
              isInProgress
              type={proposalActions.ABSTAIN}
              {...votesData[proposalActions.ABSTAIN]}
            />
          </Col>
          <Col span={8} offset={4}>
            <Circle
              className="proposal-vote-chart-circle"
              isInProgress={proposalType !== proposalTypes.REFERENDUM}
              type="Total"
              {...votesData.Total}
            />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <div className="proposal-vote-desc text-center">
              <div className="text-ellipsis" title="Abstained Votes">Abstained Votes</div>
              <div className="text-ellipsis" title={`${abstentions}(${votesData[proposalActions.ABSTAIN].rate})`}>
                <span className="sub-title gap-right-small">{abstentions}</span>
                <span>
                  (
                  {votesData[proposalActions.ABSTAIN].rate}
                  )
                </span>
              </div>
            </div>
          </Col>
          <Col span={12}>
            <div className="proposal-vote-desc text-center">
              <div className="text-ellipsis" title="Total Votes">Total Votes</div>
              <div className="text-ellipsis" title={`${approvals + rejections + abstentions}(${votesData.Total.rate})`}>
                <span className="sub-title gap-right-small">{approvals + rejections + abstentions}</span>
                <span>
                  (
                  {votesData.Total.rate}
                  )
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  return (
    <div className="proposal-vote">
      <p>Voting Data: Votes (Votes / Minimum Votes)</p>
      <Row
        gutter={16}
        className="proposal-vote-chart"
      >
        <Col span={4} offset={1}>
          <Circle
            className="proposal-vote-chart-circle"
            isInProgress
            type={proposalActions.APPROVE}
            {...votesData[proposalActions.APPROVE]}
          />
        </Col>
        <Col span={4} offset={2}>
          <Circle
            className="proposal-vote-chart-circle"
            isInProgress
            type={proposalActions.REJECT}
            {...votesData[proposalActions.REJECT]}
          />
        </Col>
        <Col span={4} offset={2}>
          <Circle
            className="proposal-vote-chart-circle"
            isInProgress
            type={proposalActions.ABSTAIN}
            {...votesData[proposalActions.ABSTAIN]}
          />
        </Col>
        <Col span={4} offset={2}>
          <Circle
            className="proposal-vote-chart-circle"
            isInProgress={proposalType !== proposalTypes.REFERENDUM}
            type="Total"
            {...votesData.Total}
          />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={6}>
          <div className="proposal-vote-desc text-center">
            <div className="text-ellipsis" title="Approved Votes">Approved Votes</div>
            <div className="text-ellipsis" title={`${approvals}(${votesData[proposalActions.APPROVE].rate})`}>
              <span className="sub-title gap-right-small">{approvals}</span>
              <span>
                (
                {votesData[proposalActions.APPROVE].rate}
                )
              </span>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="proposal-vote-desc text-center">
            <div className="text-ellipsis" title="Rejected Votes">Rejected Votes</div>
            <div className="text-ellipsis" title={`${rejections}(${votesData[proposalActions.REJECT].rate})`}>
              <span className="sub-title gap-right-small">{rejections}</span>
              <span>
                (
                {votesData[proposalActions.REJECT].rate}
                )
              </span>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="proposal-vote-desc text-center">
            <div className="text-ellipsis" title="Abstained Votes">Abstained Votes</div>
            <div className="text-ellipsis" title={`${abstentions}(${votesData[proposalActions.ABSTAIN].rate})`}>
              <span className="sub-title gap-right-small">{abstentions}</span>
              <span>
                (
                {votesData[proposalActions.ABSTAIN].rate}
                )
              </span>
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div className="proposal-vote-desc text-center">
            <div className="text-ellipsis" title="Total Votes">Total Votes</div>
            <div className="text-ellipsis" title={`${approvals + rejections + abstentions}(${votesData.Total.rate})`}>
              <span className="sub-title gap-right-small">{approvals + rejections + abstentions}</span>
              <span>
                (
                {votesData.Total.rate}
                )
              </span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

VoteChart.propTypes = {
  proposalType: PropTypes.oneOf(Object.values(proposalTypes)).isRequired,
  approvals: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  rejections: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  abstentions: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  bpCount: PropTypes.number.isRequired,
  organizationInfo: PropTypes.shape(organizationInfoPropTypes).isRequired,
};

export default VoteChart;
