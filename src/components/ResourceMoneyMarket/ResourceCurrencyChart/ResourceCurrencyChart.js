/**
 * @file ResourceCurrencyChart
 * @author zhouminghui
 * echarts
*/

import React, {PureComponent} from 'react';
import {Spin} from 'antd';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import {get} from '../../../utils';
import formateTurnoverList from '../../../utils/formateTurnoverList';
import {RESOURCE_TURNOVER} from '../../../constants';
import dayjs from 'dayjs';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import './ResourceCurrencyChart.less';

export default class ResourceCurrencyChart extends PureComponent {
    constructor(props) {
        super(props);
        this.getEchartDataTime;
        this.state = {
            loading: false,
            menuIndex: this.props.menuIndex,
            buttonIndex: 0,
            intervalTimeList: [
                300000,
                1800000,
                3600000,
                14400000,
                432000000,
                604800000
            ],
            menuName: [
                'Ram',
                'Cpu',
                'Net',
                'Sto'
            ],
            intervalTime: 300000,
            buyResource: null,
            sellResource: null,
            xAxisData: [],
            yAxisData: [],
            maxValue: null
        };
    }

    componentDidMount() {
        this.getEchartData();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.menuIndex !== state.menuIndex) {
            return {
                menuIndex: props.menuIndex
            };
        }

        return null;
    }

    componentDidUpdate(prevProps, prevStates) {
        if (prevStates.buttonIndex !== this.state.buttonIndex) {
            clearTimeout(this.getEchartDataTime);
            this.getEchartData();
        }
        if (prevProps.menuIndex !== this.props.menuIndex) {
            clearTimeout(this.getEchartDataTime);
            this.getEchartData();
        }
    }

    async getEchartData() {
        const {intervalTime, menuIndex, menuName, buttonIndex} = this.state;
        this.setState({
            loading: true
        });
        let xAxisData = [];
        let yAxisData = [];
        const time = new Date().getTime();
        const data = await get(RESOURCE_TURNOVER, {
            limit: 20,
            page: 0,
            order: 'desc',
            interval: intervalTime,
            type: menuName[menuIndex]
        }) || [];
        const buyRecords = formateTurnoverList(data.buyRecords, intervalTime, 20, 'asc', time);
        const sellRecords = formateTurnoverList(data.sellRecords, intervalTime, 20, 'asc', time);
        buyRecords.map((item, index) => {
            if (buttonIndex > 3) {
                xAxisData.push(dayjs(item.time).format('MM-DD'));
            }
            else {
                xAxisData.push(dayjs(item.time).format('HH:mm'));
            }
            if (item.count > sellRecords[index].count || item.count === sellRecords[index].count) {
                let data = {
                    value: item.count + sellRecords[index].count,
                    itemStyle: {
                        color: '#007130'
                    }
                };
                if (index === 0 || index === 9) {
                    data.value = 0;
                }
                yAxisData.push(data);
            }
            else {
                let data = {
                    value: item.count + sellRecords[index].count,
                    itemStyle: {
                        color: '#a40000'
                    }
                };
                if (index === 0 || index === 9) {
                    data.value = 0;
                }
                yAxisData.push(data);
            }
        });
        this.setState({
            xAxisData,
            yAxisData,
            loading: false
        });
        this.props.getEchartsLoading();
        this.getEchartDataTime = setTimeout(() => {
            this.getEchartData();
        }, intervalTime);
    }

    componentWillUnmount() {
        clearTimeout(this.getEchartDataTime);
    }

    handleButtonClick(index) {
        // TODO 切换数据展示时间
        const {intervalTimeList} = this.state;
        this.setState({
            buttonIndex: index,
            intervalTime: intervalTimeList[index]
        });
    }

    getOption() {
        const {xAxisData, yAxisData} = this.state;
        let maxValue =  Math.max.apply(Math, yAxisData.map((item, index) => {
            return item.value;
        }));
        if (maxValue % 2 === 0) {
            maxValue += Math.ceil(maxValue / 10);
        }
        else {
            maxValue += Math.ceil(maxValue / 10) + 1;
        }
        let option = {
            grid: {
                left: '3%',
                right: '3%',
                bottom: '3%',
                top: '6%',
                containLabel: true,
                show: true,
                // backgroundColor: '#1b1f6a',
                borderWidth: 0
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: ['Trading volume', 'Price']
            },
            xAxis: [
                {
                    type: 'category',
                    data: xAxisData,
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#C7B8CC'
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    },
                    boundaryGap: false
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '占位不显示',
                    min: 0,
                    max: maxValue,
                    show: false,
                    splitLine: false
                },
                {
                    type: 'value',
                    name: 'Trading volume',
                    show: true,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    axisLine: {
                        show: true,
                        lineStyle: {
                            color: '#C7B8CC'
                        }
                    },
                    splitLine: {
                        show: false,
                        lineStyle: {
                            color: 'rgba(255, 255, 255, 0.3)'
                        }
                    },
                    min: 0,
                    max: maxValue
                }
            ],
            markLine: {
                lineStyle: {
                    color: 'red'
                }
            },
            series: [
                {
                    name: '买卖量',
                    type: 'bar',
                    zlevel: 2,
                    data: yAxisData
                }
            ]
        };

        return option;
    }

    selectButtonHTML() {
        const buttons = ['5min', '30min', '1hour', '4hour', '5day', '1week'];
        const {buttonIndex} = this.state;
        const buttonsHTML = buttons.map((item, index) => {
                if (index !== buttonIndex) {
                    return (
                        <div
                            className='select-button-style'
                            key={index}
                            onClick={this.handleButtonClick.bind(this, index)}
                        >
                            {item}
                        </div>
                    );
                }
                return (
                    <div
                        className='select-button-style'
                        key={index}
                        onClick={this.handleButtonClick.bind(this, index)}
                        style={{background: '#26b7ff'}}
                    >
                        {item}
                    </div>
                );
            }
        );
        return buttonsHTML;
    }

    render() {
        const {loading} = this.state;
        const selectButton = this.selectButtonHTML();
        return (
            <div className='resource-currency-chart'>
                    <Spin
                        size='large'
                        spinning={loading}
                    >
                        <div className='select-button'>
                        {selectButton}
                        </div>
                        <ReactEchartsCore
                            echarts={echarts}
                            option={this.getOption()}
                            style={{height: '574px'}}
                            notMerge={true}
                            lazyUpdate={true}
                    />
                    </Spin>
            </div>
        );
    }
}