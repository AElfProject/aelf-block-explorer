/**
 * @file RealTimeTransactions
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Row, Col, Divider} from 'antd';
import {RESOURCE_REALTIME_RECORDS} from '../../../constants';
import dayjs from 'dayjs';
import {get} from '../../../utils';
import {Link} from 'react-router-dom';
// import Websocket from 'react-websocket';
import './RealTimeTransactions.less';

const limit = 5;
export default class RealTimeTransactions extends PureComponent {
    constructor(props) {
        super(props);
        this.getResourceRealtimeRecordsTimer = null;
        this.state = {
            menuIndex: this.props.menuIndex,
            menuName: [
                'Ram',
                'Cpu',
                'Net',
                'Sto'
            ],
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
                <Col span={5} offset={7}>Average price(ELF)</Col>
                <Col span={6}>Number</Col>
                <Col span={6}>Cumulative</Col>
            </Row>
        );
    }

    async getResourceRealtimeRecords() {
        const {menuIndex, menuName} = this.state;
        const type = menuName[menuIndex];
        const data = await get(RESOURCE_REALTIME_RECORDS, {
            limit,
            type
        });
        this.setState({
            recordsData: data || []
        });
        this.props.getRealTimeTransactionLoading();
        this.getResourceRealtimeRecordsTimer = setTimeout(() => {
            this.getResourceRealtimeRecords();
        }, 30000);
    }

    componentWillUnmount() {
        clearTimeout(this.getResourceRealtimeRecordsTimer);
    }

    getSellInfoHTML() {
        const {recordsData} = this.state;
        let data = null;
        if (recordsData) {
            data = recordsData.soldRecords || [];
            const recordsDataHtml = data.map((item, index) => {
                const date = dayjs(item.time).format('HH:mm:ss.SSS');
                const fee = Math.ceil(item.fee / 1000);
                return (
                    <Row className='table-sell' type='flex' align='middle' key={index}>
                        <Link to={`/tx/${item.tx_id}`} >
                            <Col span={4}>{date}</Col>
                            <Col span={3} className='sell'>sell</Col>
                            <Col span={5}>{((item.elf - fee) / item.resource).toFixed(9)}</Col>
                            <Col span={6}>{item.resource}</Col>
                            <Col span={6}>{item.elf}</Col>
                        </Link>
                    </Row>
                );
            });
            return recordsDataHtml;
        }
    }

    getBuyInfoHTML() {
        const {recordsData} = this.state;
        let data = null;
        if (recordsData) {
            data = recordsData.buyRecords || [];
            const recordsDataHtml = data.map((item, index) => {
                const date = dayjs(item.time).format('HH:mm:ss');
                const fee = Math.ceil(item.fee / 1000);
                return (
                    <Row className='table-buy' type='flex' align='middle' key={index}>
                        <Link to={`/tx/${item.tx_id}`} >
                            <Col span={4}>{date}</Col>
                            <Col span={3} className='sell'>buy</Col>
                            <Col span={5}>{((item.elf - fee) / item.resource).toFixed(9)}</Col>
                            <Col span={6}>{item.resource}</Col>
                            <Col span={6}>{item.elf}</Col>
                        </Link>
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
                <div className='real-time-transactions-head'>
                    Real time transaction
                </div>
                <div className='real-time-transactions-body'>
                    {tabaleHead}
                    {sellInfo}
                    <Divider style={{width: '94%', margin: '8px auto', background: '#411cb6'}}/>
                    {buyInfo}
                </div>
            </div>
        );
    }
}
