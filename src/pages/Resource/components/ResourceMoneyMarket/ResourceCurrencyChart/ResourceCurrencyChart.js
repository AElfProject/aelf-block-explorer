/**
 * @file ResourceCurrencyChart
 * @author zhouminghui
 * echarts
 */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';

import { isBeforeToday } from '@utils/timeUtils';
import { ELF_DECIMAL, SYMBOL } from '@config/config';
import dayjs from 'dayjs';
import moment from 'moment';
import { get } from '../../../../../utils';
import formateTurnoverList from '../../../../../utils/formateTurnoverList';
import {
  RESOURCE_TURNOVER,
  RESOURCE_CURRENCY_CHART_FETCH_INTERVAL
} from '../../../../../constants';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import './ResourceCurrencyChart.less';

class ResourceCurrencyChart extends PureComponent {
  constructor(props) {
    super(props);
    this.getEchartDataTime;
    this.state = {
      loading: false,
      menuIndex: this.props.menuIndex,
      buttonIndex: 0,
      intervalTimeList: [
        1000 * 60 * 5,
        1000 * 60 * 30,
        1000 * 60 * 60,
        1000 * 60 * 60 * 4,
        1000 * 60 * 60 * 24,
        1000 * 60 * 60 * 24 * 5,
        1000 * 60 * 60 * 24 * 7
      ],
      menuName: ['RAM', 'CPU', 'NET', 'STO'],
      intervalTime: 300000,
      buyResource: null,
      sellResource: null,
      xAxisData: [],
      yAxisData: [],
      maxValue: null
    };
  }

  async componentDidMount() {
    await this.getEchartData();
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
      this.getEchartData(true);
    }
    if (prevProps.menuIndex !== this.props.menuIndex) {
      clearTimeout(this.getEchartDataTime);
      this.getEchartData(false);
    }
  }

  async getEchartData(bool) {
    const { intervalTime, menuIndex, menuName, buttonIndex } = this.state;
    this.setState({
      loading: bool
    });
    const xAxisData = [];
    const yAxisData = [];

    const data =
      (await get(RESOURCE_TURNOVER, {
        limit: 20,
        page: 0,
        order: 'desc',
        interval: intervalTime,
        type: menuName[menuIndex]
      })) || [];

    const buyRecords = formateTurnoverList(
      data.buyRecords,
      intervalTime,
      20,
      'des'
    );
    const sellRecords = formateTurnoverList(
      data.sellRecords,
      intervalTime,
      20,
      'des'
    );

    console.log({ buyRecords, sellRecords });

    buyRecords.map((item, index) => {
      if (buttonIndex > 3) {
        xAxisData.push(dayjs(item.date).format('MM-DD'));
      } else if (isBeforeToday(item.date)) {
        xAxisData.push(dayjs(item.date).format('MM-DD HH:mm'));
      } else {
        xAxisData.push(dayjs(item.date).format('HH:mm'));
      }
      if (
        item.count > sellRecords[index].count ||
        item.count === sellRecords[index].count
      ) {
        const data = {
          value: (item.count + sellRecords[index].count) / ELF_DECIMAL,
          itemStyle: {
            // todo: Use the variable in less instead
            color: '#05ac90'
            // width: '10px'
          }
        };
        yAxisData.push(data);
      } else {
        const data = {
          value: (item.count + sellRecords[index].count) / ELF_DECIMAL,
          itemStyle: {
            color: '#d34a64'
            // width: '10px'
          }
        };
        yAxisData.push(data);
      }
    });
    // todo: handle the problem pop last element
    // xAxisData[xAxisData.length - 1] = 0;
    xAxisData.pop();
    yAxisData.pop();
    console.log({
      xAxisData,
      yAxisData
    });
    this.setState({
      xAxisData,
      yAxisData,
      loading: false
    });
    this.props.getEchartsLoading();
    this.getEchartDataTime = setTimeout(() => {
      this.getEchartData();
    }, RESOURCE_CURRENCY_CHART_FETCH_INTERVAL);
  }

  componentWillUnmount() {
    clearTimeout(this.getEchartDataTime);
  }

  handleButtonClick(index) {
    // TODO 切换数据展示时间
    const { intervalTimeList } = this.state;
    this.setState({
      buttonIndex: index,
      intervalTime: intervalTimeList[index]
    });
  }

  getOption() {
    const { xAxisData, yAxisData, intervalTime } = this.state;
    const maxValue = Math.max.apply(
      Math,
      yAxisData.map((item, index) => item.value)
    );
    const option = {
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
          type: 'none'
        }
        // todo: consider to add lastAxisValue to the tooltip
        // formatter: data => {
        //   console.log({
        //     data
        //   });
        //   const { axisValue } = data[0];
        //   const lastAxisValue = moment
        //     .unix(moment(axisValue).unix() - intervalTime)
        //     .format('MM-DD HH:mm');
        //   // intervalTime;
        //   console.log({
        //     lastAxisValue
        //   })
        //   const tipStr = `${lastAxisValue}-${axisValue}`;
        //   return tipStr;
        // }
      },
      legend: {
        data: ['Total volume of business', 'Price'],
        type: 'scroll',
        orient: 'horizontal'
      },
      // todo: how to make the xAxis/yAxis offset?
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
          axisLabel: {
            interval: 0,
            // todo: put the time before date
            formatter: value => {
              let ret = ''; // 拼接加\n返回的类目项
              const maxLength = 6; // 每项显示文字个数
              const valLength = value.length; // X轴类目项的文字个数
              const rowN = Math.ceil(valLength / maxLength); // 类目项需要换行的行数
              if (rowN > 1) {
                // 如果类目项的文字大于3,
                for (let i = 0; i < rowN; i++) {
                  let temp = ''; // 每次截取的字符串
                  const start = i * maxLength; // 开始截取的位置
                  const end = start + maxLength; // 结束截取的位置
                  // 这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = `${value.substring(start, end)}\n`;
                  ret += temp; // 凭借最终的字符串
                }
                return ret;
              }
              return value;
            }
            // align: 'left'
          },
          axisTick: {
            alignWithLabel: true
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: 'rgba(255, 255, 255, 0.3)'
            }
          }
          // boundaryGap: true
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
          name: `Trading volume / ${SYMBOL}`,
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
          name: `Total volume/${SYMBOL} of business`,
          type: 'bar',
          zlevel: 2,
          data: yAxisData,
          barWidth: 40
        }
      ]
      // dataZoom: [
      //   {
      //     type: 'slider',
      //     realtime: true, // 拖动滚动条时是否动态的更新图表数据
      //     height: 20, // 滚动条高度
      //     start: 40, // 滚动条开始位置（共100等份）
      //     end: 65, // 结束位置（共100等份）,
      //     handleColor: '#ddd', // h滑动图标的颜色
      //     handleStyle: {
      //       borderColor: '#cacaca',
      //       borderWidth: '1',
      //       shadowBlur: 2,
      //       background: '#ddd',
      //       shadowColor: '#ddd'
      //     },
      //     fillerColor: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
      //       {
      //         // 给颜色设置渐变色 前面4个参数，给第一个设置1，第四个设置0 ，就是水平渐变
      //         // 给第一个设置0，第四个设置1，就是垂直渐变
      //         offset: 0,
      //         color: '#1eb5e5'
      //       },
      //       {
      //         offset: 1,
      //         color: '#5ccbb1'
      //       }
      //     ]),
      //     backgroundColor: '#ddd' // 两边未选中的滑动条区域的颜色
      //   },
      //   {
      //     type: 'inside',
      //     show: true,
      //     xAxisIndex: [0],
      //     end: 100 - 1500 / 31, // 默认为100
      //     start: 0
      //   }
      // ]
      // backgroundColor: 'rgba(0, 0, 0, 0.1)'
    };

    return option;
  }

  selectButtonHTML() {
    // 'days'
    const buttons = [
      '5min',
      '30min',
      '1hour',
      '4hours',
      '1day',
      '5days',
      '1week'
    ];
    const { buttonIndex } = this.state;
    const buttonsHTML = buttons.map((item, index) => {
      return (
        <div
          className={`select-button-style ${
            index === buttonIndex ? 'active' : ''
          }`}
          key={index}
          onClick={this.handleButtonClick.bind(this, index)}
        >
          {item}
        </div>
      );
    });
    return buttonsHTML;
  }

  render() {
    const { isSmallScreen } = this.props;
    const { loading } = this.state;

    const selectButton = this.selectButtonHTML();
    const chartHeight = isSmallScreen ? 450 : 470;

    return (
      <div className='resource-currency-chart'>
        <div className='select-button'>{selectButton}</div>
        {/* <Spin size='large' spinning={loading}> */}
        <ReactEchartsCore
          echarts={echarts}
          option={this.getOption()}
          style={{ height: chartHeight, minWidth: 900 }}
          notMerge
          lazyUpdate
        />
        {/* </Spin> */}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.common
});

export default connect(mapStateToProps)(ResourceCurrencyChart);
