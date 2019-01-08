/**
 * @file  VotingYieldChart
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Row, Col} from 'antd';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import {dividends, consensus} from '../../utils';
import './VotingYieldChart.less';
import Svg from '../Svg/Svg';

export default class VotingYieldChart extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null
        };
    }

    componentDidMount() {
        this.setState({
            data: this.getdata()
        });
    }

    onRefresh() {
        this.setState({
            data: this.getdata()
        });
    }

    getdata() {
        let times = [30, 180, 365, 730, 1095];
        let wheels = parseInt(consensus.GetCurrentRoundNumber().return, 16);
        let session = parseInt(consensus.GetTermNumberByRoundNumber(wheels).return, 16);
        let data = [];
        for (let i = 0; i < times.length; i++) {
            let profit = parseInt(dividends.CheckDividends(10000, times[i], session - 1).return, 16);
            data[i] = profit;
        }
        return data;
    }

    getOption() {
        let option = {
            color: ['#fdd400'],
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['3 months', '6 months', '12 months', '24 months', '36 months'],
                    axisTick: {
                        alignWithLabel: true
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#9fa0af'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    name: 'dividend',
                    type: 'value',
                    splitLine: false,
                    axisLine: {
                        lineStyle: {
                            color: '#9fa0af'
                        }
                    }
                }
            ],
            series: [
                {
                    name: 'dividend income',
                    type: 'bar',
                    barWidth: '20%',
                    data: this.state.data
                }
            ]
        };
        return option;
    }
    render() {
        let loading = false;
        return (
            <div className='voting-yield-chart'>
                <div className='voting-yield-chart-title'>
                    {this.props.title}
                </div>
                <Row className='voting-yield-chart-Row'>
                    <Col xl={6} lg={6} md={0} sm={0} xs={0} >
                        <div className='voting-yield-chart-left'>
                            <div className='left-title'>
                                Historic Income Voting Dividends
                            </div>
                        </div>
                    </Col>
                    <Col xl={16} lg={16} md={22} sm={22} xs={22} >
                        <ReactEchartsCore
                            echarts={echarts}
                            showLoading={loading}
                            option={this.getOption()}
                            style={{height: '416px'}}
                            notMerge={true}
                            lazyUpdate={true}
                        />
                    </Col>
                    <Col xl={2} lg={2} md={2} sm={2} xs={2} type="flex" align="end">
                        <Svg
                            icon='refresh'
                            style={{marginTop: '30px', width: '60px', height: '60px', float: 'right'}}
                            onClick={e => this.onRefresh()}
                        />
                    </Col>
                </Row>
            </div>
        );
    }
}
