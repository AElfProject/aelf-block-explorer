/**
 * @file  VotingYieldChart
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Row, Col, Spin} from 'antd';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import hexCharCodeToStr from '../../../../utils/hexCharCodeToStr';
import Svg from '../../../../components/Svg/Svg';
import './VotingYieldChart.less';

export default class VotingYieldChart extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            loading: false,
            contracts: null
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.dividends !== state.dividends) {
            return {
                dividends: props.dividends
            };
        }

        return null;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.dividends !== this.props.dividends) {
            if (!prevProps.dividends) {
                this.setState({
                    loading: true
                });
                this.props.dividends.CheckDividendsOfPreviousTermToFriendlyString((error, result) => {
                    this.setState({
                        data: JSON.parse(hexCharCodeToStr(result.return)).Values,
                        loading: false
                    });
                });
            }
        }
    }

    onRefresh() {
        const {dividends} = this.state;
        this.setState({
            loading: true
        });
        dividends.CheckDividendsOfPreviousTermToFriendlyString((error, result) => {
            this.setState({
                data: JSON.parse(hexCharCodeToStr(result.return)).Values,
                loading: false
            });
        });
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
                <Spin
                    tip='Loading...'
                    size='large'
                    spinning={this.state.loading}
                >
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
                                className={this.state.loading ? 'refresh-animate' : ''}
                                icon='refresh'
                                style={{marginTop: '30px', width: '60px', height: '45px', float: 'right'}}
                                onClick={e => this.onRefresh()}
                            />
                        </Col>
                    </Row>
                </Spin>
            </div>
        );
    }
}
