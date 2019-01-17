/**
 * @file RealTimeTransactions
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Row, Col, Divider} from 'antd';
import './RealTimeTransactions.less';

export default class RealTimeTransactions extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            menuIndex: this.props.menuIndex
        };
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

    getSellInfoHTML() {
        return (
            <div>
                <Row className='table-sell' type='flex' align='middle'>
                    <Col span={4}>16:43:48</Col>
                    <Col span={3} className='sell'>sell</Col>
                    <Col span={5}>2.55</Col>
                    <Col span={6}>10000</Col>
                    <Col span={6}>9000</Col>
                </Row>
                <Row className='table-sell' type='flex' align='middle'>
                    <Col span={4}>16:43:48</Col>
                    <Col span={3} className='sell'>sell</Col>
                    <Col span={5}>2.55</Col>
                    <Col span={6}>10000</Col>
                    <Col span={6}>9000</Col>
                </Row>
                <Row className='table-sell' type='flex' align='middle'>
                    <Col span={4}>16:43:48</Col>
                    <Col span={3} className='sell'>sell</Col>
                    <Col span={5}>2.55</Col>
                    <Col span={6}>10000</Col>
                    <Col span={6}>9000</Col>
                </Row>
                <Row className='table-sell' type='flex' align='middle'>
                    <Col span={4}>16:43:48</Col>
                    <Col span={3} className='sell'>sell</Col>
                    <Col span={5}>2.55</Col>
                    <Col span={6}>10000</Col>
                    <Col span={6}>9000</Col>
                </Row>
                <Row className='table-sell' type='flex' align='middle'>
                    <Col span={4}>16:43:48</Col>
                    <Col span={3} className='sell'>sell</Col>
                    <Col span={5}>2.55</Col>
                    <Col span={6}>10000</Col>
                    <Col span={6}>9000</Col>
                </Row>
            </div>
        );
    }

    getBuyInfoHTML() {
        return (
            <div>
                <Row className='table-buy' type='flex' align='middle'>
                    <Col span={4}>16:43:48</Col>
                    <Col span={3} className='sell'>buy</Col>
                    <Col span={5}>2.55</Col>
                    <Col span={6}>10000</Col>
                    <Col span={6}>9000</Col>
                </Row>
                <Row className='table-buy' type='flex' align='middle'>
                    <Col span={4}>16:43:48</Col>
                    <Col span={3} className='sell'>buy</Col>
                    <Col span={5}>2.55</Col>
                    <Col span={6}>10000</Col>
                    <Col span={6}>9000</Col>
                </Row>
                <Row className='table-buy' type='flex' align='middle'>
                    <Col span={4}>16:43:48</Col>
                    <Col span={3} className='sell'>buy</Col>
                    <Col span={5}>2.55</Col>
                    <Col span={6}>10000</Col>
                    <Col span={6}>9000</Col>
                </Row>
                <Row className='table-buy' type='flex' align='middle'>
                    <Col span={4}>16:43:48</Col>
                    <Col span={3} className='sell'>buy</Col>
                    <Col span={5}>2.55</Col>
                    <Col span={6}>10000</Col>
                    <Col span={6}>9000</Col>
                </Row>
                <Row className='table-buy' type='flex' align='middle'>
                    <Col span={4}>16:43:48</Col>
                    <Col span={3} className='sell'>buy</Col>
                    <Col span={5}>2.55</Col>
                    <Col span={6}>10000</Col>
                    <Col span={6}>9000</Col>
                </Row>
            </div>
            
        );
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
