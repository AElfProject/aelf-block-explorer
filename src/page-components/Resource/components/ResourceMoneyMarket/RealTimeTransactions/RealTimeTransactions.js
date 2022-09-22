/**
 * @file RealTimeTransactions
 * @author zhouminghui
 */

import React, { PureComponent } from 'react';
import { Row, Col, Divider } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';

import Link from 'next/link';
import { SYMBOL, ELF_DECIMAL, ELF_PRECISION, REAL_TIME_FETCH_INTERVAL } from 'constants/misc';
import { thousandsCommaWithDecimal } from 'utils/formater';
import { get } from 'utils/axios';
import { RESOURCE_REALTIME_RECORDS } from 'constants/api';
require('./RealTimeTransactions.less');

const fetchLimit = 20;
const displayLimit = 5;
class RealTimeTransactions extends PureComponent {
  constructor(props) {
    super(props);
    this.getResourceRealtimeRecordsTimer = null;
    this.state = {
      recordsData: null,
    };
  }

  componentDidMount() {
    this.getResourceRealtimeRecords();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.type !== this.props.type) {
      clearTimeout(this.getResourceRealtimeRecordsTimer);
      this.getResourceRealtimeRecords();
    }
  }

  getTableHeadHTML() {
    return (
      <Row className="table-head" type="flex" align="middle">
        <Col span={6} offset={6}>
          Average price(
          {SYMBOL})
        </Col>
        <Col span={6}>Number</Col>
        <Col span={6}>Cumulative</Col>
      </Row>
    );
  }

  async getResourceRealtimeRecords() {
    const { type } = this.props;
    try {
      const data = await get(RESOURCE_REALTIME_RECORDS, {
        limit: fetchLimit,
        type,
      });
      // todo: move the logic to backend
      // todo: repeating code
      data.buyRecords = data.buyRecords
        .sort((a, b) => moment(b.time).unix() - moment(a.time).unix())
        .slice(0, displayLimit);
      data.soldRecords = data.soldRecords
        .sort((a, b) => moment(b.time).unix() - moment(a.time).unix())
        .slice(0, displayLimit);
      // console.log('data', data);
      this.setState({
        recordsData: data || [],
      });
      this.props.getRealTimeTransactionLoading();
      this.getResourceRealtimeRecordsTimer = setTimeout(() => {
        this.getResourceRealtimeRecords();
      }, REAL_TIME_FETCH_INTERVAL);
    } catch (error) {
      this.getResourceRealtimeRecordsTimer = setTimeout(() => {
        this.getResourceRealtimeRecords();
      }, REAL_TIME_FETCH_INTERVAL);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.getResourceRealtimeRecordsTimer);
  }

  getSellInfoHTML() {
    const { recordsData } = this.state;
    let data = null;
    if (recordsData) {
      data = recordsData.soldRecords || [];
      return data.map((item, index) => {
        const date = this.formatDate(item.time);
        let { resource = 0, elf = 0, fee = 0 } = item;
        resource /= ELF_DECIMAL;
        elf /= ELF_DECIMAL;
        fee /= ELF_DECIMAL;
        return (
          <Row className="table-sell" type="flex" align="middle" key={index}>
            <Col span={4}>
              <Link href={`/tx/${item.tx_id}`}>{date}</Link>
            </Col>
            <Col span={3} className="sell">
              Sell
            </Col>
            <Col span={5}>{(elf / resource).toFixed(ELF_PRECISION)}</Col>
            <Col span={6}>{thousandsCommaWithDecimal(resource)}</Col>
            <Col span={6}>{thousandsCommaWithDecimal(elf - fee)}</Col>
          </Row>
        );
      });
    }
  }

  // todo: Move to utils or redesign the mobile view
  formatDate(date) {
    const { isSmallScreen } = this.props;

    const format = isSmallScreen ? 'HH:mm:ss' : 'HH:mm:ss.SSS';
    return moment(date).format(format);
  }

  // todo: decrease the repeating code
  getBuyInfoHTML() {
    const { recordsData } = this.state;

    let data = null;
    if (recordsData) {
      data = recordsData.buyRecords || [];
      return data.map((item, index) => {
        const date = this.formatDate(item.time);
        let { resource = 0, elf = 0, fee = 0 } = item;
        resource /= ELF_DECIMAL;
        elf /= ELF_DECIMAL;
        fee /= ELF_DECIMAL;
        return (
          <Row className="table-buy" type="flex" align="middle" key={index}>
            <Col span={4}>
              <Link href={`/tx/${item.tx_id}`}>{date}</Link>
            </Col>
            <Col span={3} className="sell">
              Buy
            </Col>
            <Col span={5}>{(elf / resource).toFixed(ELF_PRECISION)}</Col>
            <Col span={6}>{thousandsCommaWithDecimal(resource)}</Col>
            <Col span={6}>{thousandsCommaWithDecimal(elf + fee)}</Col>
          </Row>
        );
      });
    }
  }

  render() {
    const tableHead = this.getTableHeadHTML();
    const sellInfo = this.getSellInfoHTML();
    const buyInfo = this.getBuyInfoHTML();
    return (
      <div className="real-time-transactions">
        <Row>
          <Col className="real-time-transactions-head">Real Time Transactions</Col>
        </Row>
        <Divider className="resource-buy-divider" />
        <div className="real-time-transactions-body">
          {tableHead}
          {sellInfo}
          {buyInfo}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.common,
});

export default connect(mapStateToProps)(RealTimeTransactions);
