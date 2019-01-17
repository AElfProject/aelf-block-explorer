/**
 * @file ResourceCurrencyChart
 * @author zhouminghui
 * echarts
*/

import React, {PureComponent} from 'react';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import './ResourceCurrencyChart.less';

export default class ResourceCurrencyChart extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            menuIndex: this.props.menuIndex,
            buttonIndex: 0
        };
    }

    getOption() {
        let option = {
            grid: {
                left: '0%',
                right: '16px',
                bottom: '16px',
                top: '16px',
                containLabel: true,
                show: true,
                // backgroundColor: '#1b1f6a',
                borderWidth: 0
            },
            legend: {
                data: ['买卖量', '价格']
            },
            xAxis: [
                {
                    type: 'category',
                    data: ['4:30', '4:40', '4:50', '5:00', '5:10', '5:20', '5:30', '5:40', '5:50', '6:00', '6:10', '6:20', '4:30', '4:40', '4:50', '5:00', '5:10', '5:20', '5:30', '5:40', '5:50', '6:00', '6:10', '6:20'],
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
                    name: '买卖量',
                    show: false,
                    min: 0,
                    max: 200,
                    splitLine: false
                },
                {
                    type: 'value',
                    name: '价格',
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
                    max: 500
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
                    data: [{value: 0}, {value: 4.9, itemStyle: {color: '#486a00'}}, {value: 7.0, itemStyle: {color: '#158df3'}}, {value:4.9, itemStyle: {color: '#486a00'}}, {value:7.8, itemStyle: {color: '#158df3'}}, 76.7, 20.6, 40.2, 32.6, 20.0, 6.4, 0]
                }
                // {
                //     name: '价格',
                //     type: 'line',
                //     zlevel: 1,
                //     lineStyle: {
                //         color: '#fff'
                //     },
                //     areaStyle: {
                //         color: {
                //                 type: 'linear',
                //                 x: 0,
                //                 y: 0,
                //                 x2: 0,
                //                 y2: 1,
                //                 colorStops: [{
                //                     offset: 0, color: '#4169E1'
                //                 }, {
                //                     offset: 1, color: '#1b1f6a'
                //                 }],
                //                 globalCoord: false
                //             }
                //     },
                //     yAxisIndex: 1,
                //     smooth: true,
                //     data: [100, 124, 324, 354, 365, 324, 333, 356, 354, 323, 323, 423]
                // }
            ]
        };

        return option;
    }

    handleButtonClick(index) {
        // TODO 切换数据展示时间
        this.setState({
            buttonIndex: index
        });
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
                <div className='select-button'>
                   {selectButton}
                </div>
                <ReactEchartsCore
                    echarts={echarts}
                    showLoading={loading}
                    option={this.getOption()}
                    style={{height: '574px'}}
                    notMerge={true}
                    lazyUpdate={true}
                />
            </div>
        );
    }
}