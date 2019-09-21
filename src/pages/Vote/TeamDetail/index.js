/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-17 15:40:06
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-21 23:21:58
 * @Description: file content
 */
import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import {
  Statistic,
  Row,
  Col,
  Button,
  Avatar,
  Tag,
  Typography,
  message
} from 'antd';
import queryString from 'query-string';

import { getTeamDesc } from '@api/vote';
import './index.less';

const { Paragraph } = Typography;

const clsPrefix = 'team-detail';

// todo: compitable for the case where user hasn't submit the team info yet.
export default class TeamDetial extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      isBP: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    const { consensusContract } = this.props;
    if (consensusContract !== prevProps.consensusContract) {
      this.justifyIsBP();
    }
  }

  fetchData() {
    const { pubkey } = queryString.parse(window.location.search);
    getTeamDesc(pubkey)
      .then(res => {
        if (res.code !== 0) {
          message.error(res.msg);
          return;
        }
        this.setState({ data: res.data });
      })
      .catch(err => message.err(err));
  }

  // todo: confirm the method works well
  justifyIsBP() {
    const { consensusContract } = this.props;
    const { data } = this.state;
    consensusContract.GetCurrentMinerList.call()
      .then(res => {
        console.log('GetCurrentMinerList', res);
        // To confirm justify is BP or not after get the team's pulic key
        if (!data.publicKey) {
          this.timer = setInterval(() => {
            if (data.publicKey) {
              clearInterval(this.timer);
              this.timer = null;
            }
          }, 300);
        }
        console.log('data.publicKey', data.publicKey);
        if (res.pubkeys.indexOf(data.publicKey) !== -1) {
          console.log("I'm BP.");
          this.setState({
            isBP: true
          });
        }
      })
      .catch(err => {
        console.error('GetCurrentMinerList', err);
      });
  }

  render() {
    const { data, isBP } = this.state;

    // todo: Is it safe if the user keyin a url that is not safe?
    return (
      <section className={`${clsPrefix} page-container`}>
        <section className={`${clsPrefix}-header card-container`}>
          <Row>
            <Col span={18} className='card-container-left'>
              <div className={`${clsPrefix}-team-avatar-info`}>
                {data.avatar ? (
                  <Avatar shape='square' size={100} src={data.avatar} />
                ) : (
                  <Avatar shape='square' size={100} icon='user' />
                )}
                <div className={`${clsPrefix}-team-info`}>
                  <h5 className={`${clsPrefix}-node-name`}>
                    {data.name || 'Default'}
                    <Tag color='#f50'>{isBP ? 'BP' : 'Candidate'}</Tag>
                  </h5>
                  <p className={`${clsPrefix}-team-info-location`}>
                    Location: {data.location}
                  </p>
                  <p className={`${clsPrefix}-team-info-address`}>
                    Node Address: <Paragraph copyable>{data.address}</Paragraph>
                  </p>
                  <Button>
                    <Link to='/vote/apply/keyin'>Edit</Link>
                  </Button>
                </div>
              </div>
            </Col>
            <Col span={6} className='card-container-right'>
              <Button size='large' type='primary' data-role='vote'>
                Vote
              </Button>
              <Button size='large' type='primary' data-role='redeem'>
                Redeem
              </Button>
            </Col>
          </Row>
        </section>
        <section className={`${clsPrefix}-statistic card-container`}>
          <Statistic title='Rank' value={15} />
          <Statistic title='Terms' value={2} />
          <Statistic title='Total Vote' value='15,233' />
          <Statistic title='Voted Rate' value='20%' />
          <Statistic title='Produced Blocks' value='15,333' />
          <Statistic title='Dividens' value='15,333' />
        </section>
        <section className={`${clsPrefix}-intro card-container`}>
          <h5 className='card-header'>Intro</h5>
          <div className='card-content'>
            {data.intro || "The team didn't fill the intro"}
          </div>
        </section>
        <section className={`${clsPrefix}-social-network card-container`}>
          <h5 className='card-header'>Social Networks</h5>
          <div className='card-content'>
            {data.socials ? (
              <ul>
                {data.socials.map(item => (
                  <li>
                    {item.type}:<a href={item.url}>{item.url}</a>
                  </li>
                ))}
              </ul>
            ) : (
              "The team didn't fill the social contacts."
            )}
          </div>
        </section>
      </section>
    );
  }
}
