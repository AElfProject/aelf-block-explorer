import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { If, Then, Else } from "react-if";
import { Row, Col, Button, Avatar, Tag, Typography, message } from "antd";
import queryString from "query-string";
import { EditOutlined, TeamOutlined } from "@ant-design/icons";

import StatisticalData from "@components/StatisticalData/";
import {
  getTeamDesc,
  fetchElectorVoteWithRecords,
  fetchPageableCandidateInformation,
  fetchCount,
} from "@api/vote";
import { fetchCurrentMinerPubkeyList } from "@api/consensus";
import { FROM_WALLET, ELF_DECIMAL } from "@src/pages/Vote/constants";
import publicKeyToAddress from "@utils/publicKeyToAddress";
import getCurrentWallet from "@utils/getCurrentWallet";
import {
  filterUserVoteRecordsForOneCandidate,
  computeUserRedeemableVoteAmountForOneCandidate,
} from "@utils/voteUtils";
import "./index.less";
import addressFormat from "../../../utils/addressFormat";

const { Paragraph } = Typography;

const clsPrefix = "team-detail";

const ellipsis = { rows: 1 };

const TableItemCount = 20;

class TeamDetail extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      candidateAddress: "",
      formattedAddress: "",
      isBP: false,
      rank: "-",
      terms: "-",
      totalVotes: "-",
      votedRate: "-",
      producedBlocks: "-",
      userRedeemableVoteAmountForOneCandidate: 0,
      hasAuth: false,
      isCandidate: true,
    };

    this.teamPubkey = queryString.parse(window.location.search).pubkey;
  }

  componentDidMount() {
    const { consensusContract, electionContract, currentWallet } = this.props;

    this.fetchData();

    if (consensusContract) {
      this.justifyIsBP();
    }

    if (electionContract !== null) {
      this.fetchDataFromElectionContract();
    }

    if (currentWallet) {
      this.setState({
        hasAuth: currentWallet.pubkey === this.teamPubkey,
      });
    }
  }

  componentDidUpdate(prevProps) {
    const { consensusContract, electionContract, currentWallet } = this.props;

    if (consensusContract !== prevProps.consensusContract) {
      this.justifyIsBP();
    }

    if (electionContract !== prevProps.electionContract) {
      this.fetchDataFromElectionContract();
    }

    if (prevProps.currentWallet !== currentWallet) {
      this.setState(
        {
          hasAuth: currentWallet.pubkey === this.teamPubkey,
        },
        this.fetchCandidateInfo
      );
    }
  }

  fetchData() {
    getTeamDesc(this.teamPubkey)
      .then((res) => {
        if (res.code !== 0) {
          return;
        }
        this.setState({ data: res.data });
      })
      .catch((err) => message.error(err));
  }

  fetchDataFromElectionContract() {
    this.fetchAllCandidateInfo();
    this.fetchTheUsersActiveVoteRecords();
  }

  async fetchTotal() {
    const res = await fetchCount(this.props.electionContract, "");
    const total = res.value?.length || 0;
    return total;
  }

  async fetchAllCandidateInfo() {
    try {
      const total = await this.fetchTotal();
      const { electionContract } = this.props;
      let start = 0;
      let result = [];
      while (start <= total) {
        // eslint-disable-next-line no-await-in-loop
        const res = await fetchPageableCandidateInformation(electionContract, {
          start,
          length: TableItemCount,
        });
        result = result.concat(res.value);
        start += 20;
      }
      this.processAllCandidateInfo(result);
    } catch (e) {
      console.error(e);
    }
  }

  processAllCandidateInfo(allCandidateInfo) {
    const candidateVotesArr = allCandidateInfo
      .map((item) => item.obtainedVotesAmount)
      .sort((a, b) => b - a);
    const currentCandidate = allCandidateInfo.find(
      (item) => item.candidateInformation.pubkey === this.teamPubkey
    );

    const candidateAddress = publicKeyToAddress(this.teamPubkey);
    const formattedAddress = addressFormat(candidateAddress);

    if (!currentCandidate) {
      this.setState({
        isCandidate: false,
        formattedAddress,
      });
      return;
    }

    const totalVoteAmount = candidateVotesArr.reduce(
      (total, current) => total + +current,
      0
    );
    const currentCandidateInfo = currentCandidate.candidateInformation;

    const rank =
      +candidateVotesArr.indexOf(currentCandidate.obtainedVotesAmount) + 1;
    const terms = currentCandidateInfo.terms.length;
    const totalVotes = currentCandidate.obtainedVotesAmount;
    const votedRate =
      totalVoteAmount === 0
        ? 0
        : ((100 * totalVotes) / totalVoteAmount).toFixed(2);
    const { producedBlocks } = currentCandidateInfo;

    this.setState({
      rank,
      terms,
      totalVotes: totalVotes / ELF_DECIMAL,
      votedRate,
      producedBlocks,
      candidateAddress,
      formattedAddress,
    });
  }

  fetchTheUsersActiveVoteRecords() {
    const { electionContract } = this.props;
    // todo: Will it break the data consistency?
    const currentWallet = getCurrentWallet();

    fetchElectorVoteWithRecords(electionContract, {
      value: currentWallet.pubKey,
    })
      .then((res) => {
        this.computeUserRedeemableVoteAmountForOneCandidate(
          res.activeVotingRecords
        );
      })
      .catch((err) => {
        console.error("fetchElectorVoteWithRecords", err);
      });
  }

  computeUserRedeemableVoteAmountForOneCandidate(usersActiveVotingRecords) {
    const userVoteRecordsForOneCandidate = filterUserVoteRecordsForOneCandidate(
      usersActiveVotingRecords,
      this.teamPubkey
    );
    const userRedeemableVoteAmountForOneCandidate =
      computeUserRedeemableVoteAmountForOneCandidate(
        userVoteRecordsForOneCandidate
      );
    this.setState({
      userRedeemableVoteAmountForOneCandidate,
    });
  }

  justifyIsBP() {
    const { consensusContract } = this.props;

    fetchCurrentMinerPubkeyList(consensusContract)
      .then((res) => {
        if (res.pubkeys.indexOf(this.teamPubkey) !== -1) {
          this.setState({
            isBP: true,
          });
        }
      })
      .catch((err) => {
        console.error("fetchCurrentMinerPubkeyList", err);
      });
  }

  getStaticData() {
    const { rank, terms, totalVotes, votedRate, producedBlocks } = this.state;

    return {
      rank: {
        title: "Rank",
        num: rank,
      },
      terms: {
        title: "Terms",
        num: terms,
      },
      totalVotes: {
        title: "Total Vote",
        num: totalVotes,
      },
      votedRate: {
        title: "Voted Rate",
        num: `${votedRate}%`,
      },
      producedBlocks: {
        title: "Produced Blocks",
        num: producedBlocks,
      },
    };
  }

  renderTopTeamInfo() {
    const isSmallScreen = document.body.offsetWidth < 768;
    const {
      formattedAddress,
      isBP,
      userRedeemableVoteAmountForOneCandidate,
      hasAuth,
      data,
      isCandidate,
    } = this.state;

    const avatarSize = isSmallScreen ? 50 : 150;
    const getTag = () => {
      if (isBP) {
        return "BP";
      }
      if (isCandidate) {
        return "Candidate";
      }
      return "Quited";
    };
    return (
      <section className={`${clsPrefix}-header card-container`}>
        <Row>
          <Col md={18} sm={24} xs={24} className="card-container-left">
            <Row className={`${clsPrefix}-team-avatar-info`}>
              <Col md={6} sm={6} xs={6} className="team-avatar-container">
                {data.avatar ? (
                  <Avatar shape="square" size={avatarSize} src={data.avatar} />
                ) : (
                  <Avatar shape="square" size={avatarSize}>
                    U
                  </Avatar>
                )}
              </Col>
              <Col className={`${clsPrefix}-team-info`} md={18} sm={18} xs={18}>
                <h5 className={`${clsPrefix}-node-name ellipsis`}>
                  {data.name ? data.name : formattedAddress}
                  <Tag color="#f50">{getTag()}</Tag>
                </h5>
                <Paragraph ellipsis={{ rows: 1 }}>
                  Location: {data.location || "-"}
                </Paragraph>
                <Paragraph
                  copyable={{ text: formattedAddress }}
                  ellipsis={ellipsis}
                >
                  Address: {formattedAddress}
                </Paragraph>
                <If condition={!!data.officialWebsite}>
                  <Then>
                    <Paragraph ellipsis={ellipsis}>
                      Official Website:&nbsp;
                      <a
                        href={data.officialWebsite}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {data.officialWebsite}
                      </a>
                    </Paragraph>
                  </Then>
                </If>
                <If condition={!!data.mail}>
                  <Then>
                    <Paragraph ellipsis={ellipsis}>
                      Email:&nbsp;
                      <a
                        href={`mailto:${data.mail}`}
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {data.mail}
                      </a>
                    </Paragraph>
                  </Then>
                </If>
                {hasAuth ? (
                  <Button type="primary" shape="round" className="edit-btn">
                    <Link
                      to={{
                        pathname: "/vote/apply/keyin",
                        search: `pubkey=${this.teamPubkey}`,
                      }}
                    >
                      Edit
                    </Link>
                  </Button>
                ) : null}
              </Col>
            </Row>
          </Col>
          <Col md={6} xs={0} className="card-container-right">
            <Button
              className="table-btn vote-btn"
              type="primary"
              shape="round"
              disabled={!isCandidate}
              data-role="vote"
              data-shoulddetectlock
              data-votetype={FROM_WALLET}
              data-nodeaddress={formattedAddress}
              data-nodename={data.name || formattedAddress}
              data-targetpublickey={this.teamPubkey}
            >
              Vote
            </Button>
            <Button
              className="table-btn redeem-btn"
              type="primary"
              shape="round"
              data-role="redeem"
              data-shoulddetectlock
              data-nodeaddress={formattedAddress}
              data-targetpublickey={this.teamPubkey}
              data-nodename={data.name}
              disabled={userRedeemableVoteAmountForOneCandidate <= 0}
            >
              Redeem
            </Button>
          </Col>
        </Row>
      </section>
    );
  }

  render() {
    const { data } = this.state;

    const staticsData = { ...this.getStaticData() };
    const topTeamInfo = this.renderTopTeamInfo();

    return (
      <section className={`${clsPrefix}`}>
        {topTeamInfo}
        <StatisticalData data={staticsData} inline />
        <section className={`${clsPrefix}-intro card-container`}>
          <h5 className="card-header">
            <EditOutlined className="card-header-icon" />
            Introduction
          </h5>
          <div className="card-content">
            <If condition={!!data.intro}>
              <Then>
                <p>{data.intro}</p>
              </Then>
              <Else>
                <div className="vote-team-detail-empty">
                  The team didn&apos;t fill the introduction.
                </div>
              </Else>
            </If>
          </div>
        </section>
        <section className={`${clsPrefix}-social-network card-container`}>
          <h5 className="card-header">
            <TeamOutlined className="card-header-icon" />
            Social Network
          </h5>
          <div className="card-content">
            <If condition={!!(data.socials && data.socials.length > 0)}>
              <Then>
                <div className="vote-team-detail-social-network">
                  {(data.socials || []).map((item) => (
                    <div className="vote-team-detail-social-network-item">
                      <span className="vote-team-detail-social-network-item-title">
                        {item.type}
                      </span>
                      <span className="vote-team-detail-social-network-item-url">
                        :&nbsp;
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer noopener"
                        >
                          {item.url}
                        </a>
                      </span>
                    </div>
                  ))}
                </div>
              </Then>
              <Else>
                <span className="vote-team-detail-empty">
                  The team didn&apos;t fill the social contacts.
                </span>
              </Else>
            </If>
          </div>
        </section>
      </section>
    );
  }
}

export default TeamDetail;
