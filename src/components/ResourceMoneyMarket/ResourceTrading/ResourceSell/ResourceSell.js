/**
 * @file ResourceSell.js
 * @author zhouminghui
 * trading - sell
*/

import React, {Component} from 'react';
import {Row, Col, Input, Slider} from 'antd';
import getMenuName from '../../../../utils/getMenuName';
import './ResourceSell.less';

export default class ResourceBuy extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuName: null,
            menuIndex: this.props.menuIndex,
            value: 2000,
            ELFValue: 1000,
            region: 250,
            purchaseQuantity: 0
        };
    }

    componentDidMount() {
        const {menuIndex} = this.state;
        this.setState({
            menuName: getMenuName(menuIndex)
        });
    }

    getSlideMarks() {
        const {region} = this.state;
        const regionLine = [0, region, region * 2, region * 3, region * 4];
        let marks = {};
        regionLine.map(item => {
            marks[item] = '';
        });
        return marks;
    }

    onChangeSlide(e) {
        this.setState({
            purchaseQuantity: e
        });
    }

    render() {
        const {region, purchaseQuantity, menuName} = this.state;
        return (
            <div className='trading-box trading-sell'>
                <div className='trading'>
                    <div className='trading-title'>
                        Sell
                    </div>
                    <div className='trading-input'>
                        <Row type='flex' align='middle'>
                            <Col span={6} style={{color: '#fff'}}>Buying quantity </Col>
                            <Col span={18}>
                                <Input addonAfter={menuName} />
                            </Col>
                        </Row>
                        <div className='ELF-value'>≈ {this.state.ELFValue}</div>
                        <Row type='flex' align='middle'>
                            <Col span={6} style={{color: '#fff'}}>Available</Col>
                            <Col span={18}>
                                <Input
                                    value={this.state.value}
                                    addonAfter={menuName}
                                    disabled={true}
                                />
                            </Col>
                        </Row>
                    </div>
                    <div className='trading-slide'>
                        <Slider
                            marks={this.getSlideMarks()}
                            step={region}
                            min={0}
                            onChange={e => this.onChangeSlide(e) }
                            max={this.state.ELFValue}
                            tooltipVisible={false}
                        />
                        <div className='ElF-value'>{purchaseQuantity} {menuName}</div>
                    </div>
                    <div
                        className='trading-button'
                        style={{background: '#8c042a'}}
                        onClick={this.props.handleSellModalShow}
                    >Sell</div>
                </div>
            </div>
        );
    }
}