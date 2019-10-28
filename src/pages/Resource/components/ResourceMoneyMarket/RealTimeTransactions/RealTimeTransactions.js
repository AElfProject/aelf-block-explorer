/**
 * @file RealTimeTransactions
 * @author zhouminghui
 */

import React, { PureComponent } from 'react';
import { Row, Col, Divider } from 'antd';
import { RESOURCE_REALTIME_RECORDS } from '../../../../../constants';
import dayjs from 'dayjs';
import moment from 'moment';
import { get } from '../../../../../utils';
import { Link } from 'react-router-dom';
import {
  SYMBOL,
  ELF_DECIMAL,
  ELF_PRECISION,
  TXSSTATUS,
  REAL_TIME_FETCH_INTERVAL
} from '@src/constants';
import { thousandsCommaWithDecimal } from '@utils/formater';
import './RealTimeTransactions.less';

const fetchLimit = 20;
const displayLimit = 5;
export default class RealTimeTransactions extends PureComponent {
  constructor(props) {
    super(props);
    this.getResourceRealtimeRecordsTimer = null;
    this.state = {
      menuIndex: this.props.menuIndex,
      menuName: ['Ram', 'Cpu', 'Net', 'Sto'],
      recordsData: null
    };
  }

  componentDidMount() {
    this.getResourceRealtimeRecords();
  }

  static getDerivedStateFromProps(props, state) {
    if (props.menuIndex !== state.menuIndex) {
      return {
        menuIndex: props.menuIndex
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    if (prevProps.menuIndex !== this.props.menuIndex) {
      clearTimeout(this.getResourceRealtimeRecordsTimer);
      this.getResourceRealtimeRecords();
    }
  }

  getTableHeadHTML() {
    return (
      <Row className='table-head' type='flex' align='middle'>
        <Col span={5} offset={7}>
          Average price({SYMBOL})
        </Col>
        <Col span={6}>Number</Col>
        <Col span={6}>Cumulative</Col>
      </Row>
    );
  }

  async getResourceRealtimeRecords() {
    const { menuIndex, menuName } = this.state;
    const type = menuName[menuIndex];
    const data = await get(RESOURCE_REALTIME_RECORDS, {
      limit: fetchLimit,
      type
    });
    // todo: move the logic to backend
    // todo: repeating code
    data.buyRecords = data.buyRecords
      .filter(item => item.tx_status === TXSSTATUS.Mined)
      .sort((a, b) => moment(b.time).unix() - moment(a.time).unix())
      .slice(0, displayLimit)
      .map(item => {
        item.resource = +item.resource / ELF_DECIMAL;
        return item;
      });
    data.soldRecords = data.soldRecords
      .filter(item => item.tx_status === TXSSTATUS.Mined)
      .sort((a, b) => moment(b.time).unix() - moment(a.time).unix())
      .slice(0, displayLimit)
      .map(item => {
        item.resource = +item.resource / ELF_DECIMAL;
        return item;
      });
    // console.log('data', data);
    this.setState({
      recordsData: data || []
    });
    this.props.getRealTimeTransactionLoading();
    this.getResourceRealtimeRecordsTimer = setTimeout(() => {
      this.getResourceRealtimeRecords();
    }, REAL_TIME_FETCH_INTERVAL);
  }

  componentWillUnmount() {
    clearTimeout(this.getResourceRealtimeRecordsTimer);
  }

  getSellInfoHTML() {
    const { recordsData } = this.state;
    let data = null;
    if (recordsData) {
      data = recordsData.soldRecords || [];
      const recordsDataHtml = data.map((item, index) => {
        const date = dayjs(item.time).format('HH:mm:ss.SSS');
        // const fee = Math.ceil(item.fee / 1000);
        const { resource } = item;
        let { elf, fee } = item;
        elf /= ELF_DECIMAL;
        fee /= ELF_DECIMAL;
        return (
          <Row className='table-sell' type='flex' align='middle' key={index}>
            <Col span={4}>
              <Link to={`/tx/${item.tx_id}`}>{date}</Link>
            </Col>
            <Col span={3} className='sell'>
              sell
            </Col>
            <Col span={5}>
              {((elf - fee) / resource).toFixed(ELF_PRECISION)}
            </Col>
            <Col span={6}>{thousandsCommaWithDecimal(resource)}</Col>
            <Col span={6}>{thousandsCommaWithDecimal(elf - fee)}</Col>
          </Row>
        );
      });
      return recordsDataHtml;
    }
  }

  getBuyInfoHTML() {
    const { recordsData } = this.state;
    let data = null;
    if (recordsData) {
      data = recordsData.buyRecords || [];
      // console.log('data', data);
      const recordsDataHtml = data.map((item, index) => {
        const date = dayjs(item.time).format('HH:mm:ss.SSS');
        let { elf, fee } = item;
        elf /= ELF_DECIMAL;
        fee /= ELF_DECIMAL;
        // const fee = Math.ceil(item.fee / 1000);
        // const fee = item.fee / 1000;
        // console.log('fee', fee);
        return (
          <Row className='table-buy' type='flex' align='middle' key={index}>
            <Col span={4}>
              <Link to={`/tx/${item.tx_id}`}>{date}</Link>
            </Col>
            <Col span={3} className='sell'>
              buy
            </Col>
            <Col span={5}>
              {((elf + fee) / item.resource).toFixed(ELF_PRECISION)}
            </Col>
            <Col span={6}>{thousandsCommaWithDecimal(item.resource)}</Col>
            <Col span={6}>{thousandsCommaWithDecimal(elf + fee)}</Col>
          </Row>
        );
      });
      return recordsDataHtml;
    }
  }

  render() {
    const tabaleHead = this.getTableHeadHTML();
    const sellInfo = this.getSellInfoHTML();
    const buyInfo = this.getBuyInfoHTML();
    return (
      <div className='real-time-transactions'>
        <div className='real-time-transactions-head'>Real time transaction</div>
        <div className='real-time-transactions-body'>
          {tabaleHead}
          {sellInfo}
          <Divider
            style={{ width: '94%', margin: '8px auto', background: '#411cb6' }}
          />
          {buyInfo}
        </div>
      </div>
    );
  }
}
