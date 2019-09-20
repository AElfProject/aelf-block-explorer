/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-17 15:40:06
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-18 14:08:17
 * @Description: file content
 */
import React, { PureComponent } from 'react';
import {Link} from 'react-router-dom';
import { Statistic, Row, Col, Button, Avatar, Tag, Typography } from 'antd';

import './index.less';

const { Paragraph } = Typography;

const clsPrefix = 'team-detail';

// todo: compitable for the case where user hasn't submit the team info yet.
export default class TeamDetial extends PureComponent {
  render() {
    return (
      <section className={`${clsPrefix} page-container`}>
        <section className={`${clsPrefix}-header card-container`}>
          <Row>
            <Col span={18} className='card-container-left'>
              <div className={`${clsPrefix}-team-avatar-info`}>
                <Avatar shape='square' size={100} icon='user' />
                <div className={`${clsPrefix}-team-info`}>
                  <h5 className={`${clsPrefix}-node-name`}>
                    Node Name<Tag color='#f50'>BP</Tag>
                  </h5>
                  <p className={`${clsPrefix}-team-info-location`}>
                    Location: China
                  </p>
                  <p className={`${clsPrefix}-team-info-address`}>
                    Node Address:{' '}
                    <Paragraph copyable>
                      HUAISB76458602495hdjfbisdbnjkf
                    </Paragraph>
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
            流动性偏好理论是解释债券 (金融资产)
            利率期限结构的一种理论。该理论认为，债券的到期期限越长，价格变化越大，流动性越差，其风险也越大;
            为补偿这种流动性风险，投资者对长期债券所要求的收益率比短期债券要求收益率要高。流动性偏好理论和预期理论结合起来，能更好地解释利率期限结构的实际情况。流动性偏好理论是解释债券
            (金融资产) 利率期限结构的一种理论。
            流动性偏好理论和预期理论结合起来，能更好地解释利率期限结构的实际情况。流动性偏好理论是解释债券
            (金融资产)
            利率期限结构的一种理论。该理论认为，债券的到期期限越长，价格变化越大，流动性越差，其风险也越大;
            为补偿这种流动性风险，投资者对长期债券所要求的收益率比短期债券要求收益率要高。流动性偏好理论和预期理论结合起来，能更好地解释利率期限结构的实际情况。投资者对长期债券所要求的收益率比短期债券要求收益率要高。流动性偏好理论和预期理论结合起来，能更好地解释利率期限结构的实际情况。
          </div>
        </section>
        <section className={`${clsPrefix}-social-network card-container`}>
          <h5 className='card-header'>Social Networks</h5>
          <div className='card-content'>
            <ul>
              <li>
                Facebook:{' '}
                <a href='https://Facebook.com'>https://Facebook.com</a>{' '}
              </li>
              <li>
                Facebook:{' '}
                <a href='https://Facebook.com'>https://Facebook.com</a>{' '}
              </li>
              <li>
                Facebook:{' '}
                <a href='https://Facebook.com'>https://Facebook.com</a>{' '}
              </li>
            </ul>
          </div>
        </section>
      </section>
    );
  }
}
