import React from "react";
// import the core library.
import ReactEchartsCore from "echarts-for-react/lib/core";

// then import echarts modules those you have used manually.
import echarts from "echarts/lib/echarts";
import "echarts/lib/chart/line";

// The usage of ReactEchartsCore are same with above.
export default class TPSChart extends React.Component {
    constructor(props) {
        super(props);
    }

    async componentDidMount() {

    }

    getOption() {

        let option = option = {
            // backgroundColor: 'rgba(57, 0, 77, 1)',
            grid: {
                left: '0%',
                right: '16px',
                bottom: '16px',
                top: '16px',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:  ['01', '02', '03', '04', '05', '06' ,'07', '08', '09', '10', '11', '12'],
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#C7B8CC'
                    }
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: 'rgba(255, 255, 255, 0.3)'
                    }
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    show: false,
                    lineStyle: {
                        color: '#C7B8CC'
                    }
                },
                splitLine: {
                    show: false
                }
            },
            markLine: {
                lineStyle: {
                    color: 'red'
                }
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 820, 932, 901, 934, 1290, {
                    value: 2333,
                    symbol: 'image://data:image/png;base64,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',
                    symbolSize: [30, 30],
                    label: {
                        show: true
                    }
                }],
                type: 'line',
                lineStyle: {
                    color: '#DF80FF'
                },
                itemStyle: {
                    color: '#D24CFF'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        y: 1,
                        y2: 0,
                        colorStops: [{
                            offset: 1,
                            color: '#D24CFF' // 0% 处的颜色
                        },
                            {
                                offset: 0,
                                color: 'rgba(51, 177, 255, 0)' // 100% 处的颜色
                            }],
                        globalCoord: false // 缺省为 false
                    }
                }
            }]
        };

        return option;
    }

    render() {
        let loading = false;
        return (
            <div>
                <ReactEchartsCore
                    echarts={echarts}
                    showLoading={loading}
                    option={this.getOption()}
                    notMerge={true}
                    lazyUpdate={true}
                />
            </div>
        );
    }
}
