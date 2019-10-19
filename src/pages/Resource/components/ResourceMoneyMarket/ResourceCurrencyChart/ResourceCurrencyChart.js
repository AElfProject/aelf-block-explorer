/**
 * @file ResourceCurrencyChart
 * @author zhouminghui
 * echarts
 */

import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import { get } from '../../../../../utils';
import formateTurnoverList from '../../../../../utils/formateTurnoverList';
import {
  RESOURCE_TURNOVER,
  RESOURCE_CURRENCY_CHART_FETCH_INTERVAL
} from '../../../../../constants';
import { ELF_DECIMAL, SYMBOL } from '@config/config';
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
    let xAxisData = [];
    let yAxisData = [];

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
      } else {
        xAxisData.push(dayjs(item.date).format('HH:mm'));
      }
      if (
        item.count > sellRecords[index].count ||
        item.count === sellRecords[index].count
      ) {
        let data = {
          value: (item.count + sellRecords[index].count) / ELF_DECIMAL,
          itemStyle: {
            color: '#007130'
          }
        };
        yAxisData.push(data);
      } else {
        let data = {
          value: (item.count + sellRecords[index].count) / ELF_DECIMAL,
          itemStyle: {
            color: '#a40000'
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
    const { xAxisData, yAxisData } = this.state;
    const maxValue = Math.max.apply(
      Math,
      yAxisData.map((item, index) => {
        return item.value;
      })
    );
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
          type: 'none'
        }
      },
      legend: {
        data: ['Total volume of business', 'Price']
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
            interval: 0
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
          data: yAxisData
        }
      ]
    };

    return option;
  }

  selectButtonHTML() {
    // 'days'
    const buttons = [
      '5 minutes',
      '30 minutes',
      'hours',
      '4 hours',
      'days',
      '5 days',
      'weeks'
    ];
    const { buttonIndex } = this.state;
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
          style={{ background: '#26b7ff' }}
        >
          {item}
        </div>
      );
    });
    return buttonsHTML;
  }

  render() {
    const { loading } = this.state;
    const selectButton = this.selectButtonHTML();
    return (
      <div className='resource-currency-chart'>
        <div className='select-button'>{selectButton}</div>
        {/* <Spin size='large' spinning={loading}> */}
        <ReactEchartsCore
          echarts={echarts}
          option={this.getOption()}
          style={{ height: '574px' }}
          notMerge={true}
          lazyUpdate={true}
        />
        {/* </Spin> */}
      </div>
    );
  }
}
