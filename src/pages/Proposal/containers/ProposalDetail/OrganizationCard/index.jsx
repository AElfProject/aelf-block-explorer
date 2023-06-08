/**
 * @file desc list
 * @author atom-yang
 */
import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Card, Row, Col } from "antd";
import {
  getOrganizationLeftInfo,
  getCircleValues,
} from "../../OrganizationList/Organization";
import constants, {
  organizationInfoPropTypes,
} from "../../../../../redux/common/constants";
import addressFormat from "../../../../../utils/addressFormat";

const { proposalActions } = constants;

const OrganizationCard = (props) => {
  const {
    proposalType,
    bpCount,
    releaseThreshold,
    leftOrgInfo,
    orgAddress,
    bpList,
    parliamentProposerList,
    className,
  } = props;
  const thresholdValue = useMemo(
    () =>
      getCircleValues(
        proposalType,
        releaseThreshold,
        leftOrgInfo,
        bpCount || bpList.length
      ),
    [proposalType, releaseThreshold, leftOrgInfo, bpList]
  );
  const leftInfo = useMemo(
    () =>
      getOrganizationLeftInfo(
        proposalType,
        leftOrgInfo,
        bpList,
        parliamentProposerList
      ),
    [proposalType, leftOrgInfo, bpList, parliamentProposerList]
  );
  return (
    <Card className={className} title="Organization Info">
      <div className="gap-bottom-large">
        <span className="sub-title">Address:</span>
        <span>{addressFormat(orgAddress)}</span>
      </div>
      <Row gutter={16}>
        <Col sm={12} xs={24}>
          <>
            <div
              className="gap-bottom-small text-ellipsis"
              title={`${thresholdValue[proposalActions.APPROVE].num}(${
                thresholdValue[proposalActions.APPROVE].rate
              })`}
            >
              <span className="sub-title gap-right-small">
                Minimal Approval Threshold:
              </span>
              <span className="text-ell">
                {thresholdValue[proposalActions.APPROVE].num}(
                {thresholdValue[proposalActions.APPROVE].rate})
              </span>
            </div>
            <div
              className="gap-bottom-small text-ellipsis"
              title={`${thresholdValue[proposalActions.REJECT].num}(${
                thresholdValue[proposalActions.REJECT].rate
              })`}
            >
              <span className="sub-title gap-right-small">
                Maximal Rejection Threshold:
              </span>
              <span>
                {thresholdValue[proposalActions.REJECT].num}(
                {thresholdValue[proposalActions.REJECT].rate})
              </span>
            </div>
            <div
              className="gap-bottom-small text-ellipsis"
              title={`${thresholdValue[proposalActions.ABSTAIN].num}(${
                thresholdValue[proposalActions.ABSTAIN].rate
              })`}
            >
              <span className="sub-title gap-right-small">
                Maximal Abstention Threshold:
              </span>
              <span>
                {thresholdValue[proposalActions.ABSTAIN].num}(
                {thresholdValue[proposalActions.ABSTAIN].rate})
              </span>
            </div>
            <div
              className="gap-bottom-small text-ellipsis"
              title={`${thresholdValue.Total.num}(${thresholdValue.Total.rate})`}
            >
              <span className="sub-title gap-right-small">
                Minimal Vote Threshold:
              </span>
              <span>
                {thresholdValue.Total.num}({thresholdValue.Total.rate})
              </span>
            </div>
          </>
        </Col>
        <Col sm={12} xs={24}>
          {leftInfo}
        </Col>
      </Row>
    </Card>
  );
};

OrganizationCard.propTypes = {
  ...organizationInfoPropTypes,
  bpList: PropTypes.arrayOf(PropTypes.string).isRequired,
  parliamentProposerList: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default OrganizationCard;
