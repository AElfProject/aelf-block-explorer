/**
 * @file proposal rules
 * @author atom-yang
 */
import React from 'react';
import { Typography, Divider } from 'antd';
require('./index.less');

const { Paragraph, Title } = Typography;

/* eslint-disable max-len */

const Rules = () => (
  <Typography className="rules">
    <Title level={2} className="rules-title">
      Proposal Rules
    </Title>
    <Divider />
    <Title level={3}>1. Proposal Introduction:</Title>
    <Paragraph>
      The aelf proposal project creates an environment that allows production nodes to vote (Approve/Reject/Abstain) on
      projects that contribute to advancing the aelf ecosystem.
    </Paragraph>
    <Title level={3}>2. Proposal Steps:</Title>
    <Title level={4}>2.1 Apply for a proposal</Title>
    <Title level={4}>2.2 Organization to vote</Title>
    <Title level={4}>2.3 Release the proposal</Title>
    <Title level={3}>3. Specific rules: </Title>
    <Title level={4}>3.1. Applying for a proposal: </Title>
    <Paragraph>
      <ul>
        <li>
          Users in the organization&apos;s Proposer WhiteList can apply for a proposal. They will need to fill in or
          select the proposal model, contract and contract method, organization, and expiration time as required. This
          information will be made public on the list of proposals.
        </li>
      </ul>
    </Paragraph>
    <Title level={4}>3.2 Organizations: </Title>
    <Paragraph>
      <ul>
        <li>
          Organization members are responsible for voting; any user with an aelf address can create an organization.
          This includes setting Organization members/Token types, Proposal execution threshold ratios/quantities, and
          Proposer WhiteList. After selecting an organization, any proposal must comply with the organization&lsquo;s
          regulations.
        </li>
        <li>
          The organization members and their rules are different under different proposal modes:
          <ul>
            <li>The organization members of the &quot;association contract&quot; model can be set to any user;</li>
            <li>The organization members of the &quot;congressional contract&quot; model are production nodes.</li>
          </ul>
        </li>
        <li>
          Organization rules can be modified through a proposal, and the modification requires the votes of other
          members in the organization
        </li>
        <li>
          After the proposal under the &quot;referendum contract&quot; model expires, you can obtain voting mortgage
          tokens.
        </li>
      </ul>
    </Paragraph>
    <Title level={4}>3.3 Voting: </Title>
    <Paragraph>
      <ul>
        <li>
          Thresholds for the implementation of proposals include 4 types:
          <ul>
            <li>Minimum approval threshold</li>
            <li>Maximum rejection threshold</li>
            <li>Maximum abstention threshold</li>
            <li>Minimum vote threshold</li>
          </ul>
        </li>
      </ul>
      As long as the number of approved votes is reached before expiration, the initiator can execute the minimum
      approval threshold and minimum vote threshold.
      <ul>
        <li>The Proposer must release the proposal before the expiration time.</li>
      </ul>
    </Paragraph>
  </Typography>
);

export default Rules;
