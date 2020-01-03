/**
 * @file ResourceCurrencyChart
 * @author zhouminghui
 * echarts
 */

import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import { Icon, Tabs, Button, Divider } from 'antd';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import {isBeforeToday} from '@utils/timeUtils';
import {ELF_DECIMAL, SYMBOL} from '@src/constants';
import dayjs from 'dayjs';
import {get} from '../../../../../utils';
import {RESOURCE_CURRENCY_CHART_FETCH_INTERVAL, RESOURCE_TURNOVER} from '../../../../../constants';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import './ResourceCurrencyChart.less';

class ResourceCurrencyChart extends PureComponent {
  constructor(props) {
    super(props);
    this.getEchartDataTime = null;
    this.state = {
      loading: false,
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
      intervalTime: 300000,
      xAxisData: [],
      yAxisData: [],
      maxValue: null
    };
    this.typeChange = this.typeChange.bind(this);
  }

  async componentDidMount() {
    const {
      isSmallScreen
    } = this.props;
    const chartHeight = isSmallScreen ? 450 : 470;
    this.echartStyle = {
      height: chartHeight
    };
    await this.getEchartData();
  }

  componentDidUpdate(prevProps, prevStates) {
    // 时间维度
    if (prevStates.buttonIndex !== this.state.buttonIndex) {
      clearTimeout(this.getEchartDataTime);
      this.getEchartData();
    }
    // 沙雕，为CPU等资源类型
    if (prevProps.currentResourceIndex !== this.props.currentResourceIndex) {
      clearTimeout(this.getEchartDataTime);
      this.getEchartData();
    }
  }

  async getEchartData() {
    const {
      currentResourceIndex,
      currentResourceType
    } = this.props;
    const {intervalTime, buttonIndex} = this.state;
    this.setState({
      loading: true
    });
    let xAxisData = [];
    let yAxisData = [];

    const data =
      (await get(RESOURCE_TURNOVER, {
        limit: 20,
        page: 0,
        order: 'desc',
        interval: intervalTime,
        type: currentResourceType
      })) || {
          buyRecords: [],
          sellRecords: []
      };

    const {buyRecords, sellRecords} = data;
    buyRecords.map((item, index) => {
      if (buttonIndex > 3) {
        xAxisData.push(dayjs(item.date).format('MM-DD'));
      } else if (isBeforeToday(buyRecords[0].date)) {
        xAxisData.push(dayjs(item.date).format('MM-DD HH:mm'));
      } else {
        xAxisData.push(dayjs(item.date).format('HH:mm'));
      }
      yAxisData.push({
        value: ((item.count + sellRecords[index].count) / ELF_DECIMAL).toFixed(2),
        itemStyle: {
          opacity: 0
          // color: 'green'
        }
      });
    });

    const offsetWidth = document.body.offsetWidth;
    if (offsetWidth < 900 && offsetWidth > 768) {
      xAxisData = xAxisData.slice(5);
      yAxisData = yAxisData.slice(5);
    } else if (offsetWidth < 768) {
      xAxisData = xAxisData.slice(12);
      yAxisData = yAxisData.slice(12);
    } else if (offsetWidth <= 414) {
      xAxisData = xAxisData.slice(18);
      yAxisData = yAxisData.slice(18);
    }

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
    const { intervalTimeList } = this.state;
    this.setState({
      buttonIndex: index,
      intervalTime: intervalTimeList[index]
    });
  }

  getOption() {
    const { xAxisData, yAxisData,  } = this.state;
    const maxValue = Math.ceil(Math.max.apply(
      Math,
      yAxisData.map(item => item.value)
    ));
    return {
      grid: {
        left: '0',
        right: '3%',
        bottom: '0',
        top: '6%',
        containLabel: true,
        show: true,
        borderWidth: 0
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'none'
        }
        // todo: consider to add lastAxisValue to the tooltip
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
          boundaryGap: false,
          axisLine: {
            show: true,
            lineStyle: {
              // color: '#C7B8CC'
              color: '#666'
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
          name: `Volume / ${SYMBOL}`,
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
              color: '#666'
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
          color: '#666'
        }
      },
      series: [
        {
          smooth: true,
          name: `Total volume/${SYMBOL} of business`,
          type: 'line',
          data: yAxisData,
          lineStyle: {
            color: '#666'
          },
        }
      ]
    };
  }

  typeChange(activeKey) {
    const {
      getMenuClick
    } = this.props;
    getMenuClick(+activeKey);
  }

  selectButtonHTML() {
    // 'days'
    const buttons = [
      '5 Min',
      '30 Min',
      '1 Hour',
      '4 Hours',
      '1 Day',
      '5 Days',
      '1 Week'
    ];
    const { buttonIndex } = this.state;
    const buttonsHTML = buttons.map((item, index) => {
      return (
        <Button
          className="time-button"
          shape="round"
          type={index === buttonIndex ? 'primary' : ''}
          size="small"
          key={index}
          onClick={this.handleButtonClick.bind(this, index)}
        >
          {item}
        </Button>
      );
    });
    return buttonsHTML;
  }

  render() {
    const {
      list,
      currentIndex
    } = this.props;
    const selectButton = this.selectButtonHTML();

    return (
      <div className='resource-currency-chart'>
        <div className="resource-header">
          <div className="resource-header-title">
            <Icon type="area-chart" className="resource-icon" />
            <span className="resource-title">Resource Money Market</span>
          </div>
          <div className="resource-header-title-btn">
            {selectButton}
          </div>
        </div>
        <div className="resource-sub-container">
          <Tabs className="resource-type-switch" onChange={this.typeChange}>
            {list.map(v => (
                <Tabs.TabPane
                    key={v}
                    tab={v}
                />
            ))}
          </Tabs>
          <ReactEchartsCore
            echarts={echarts}
            option={this.getOption()}
            style={this.echartStyle}
            notMerge={true}
            lazyUpdate={true}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  ...state.common
});

export default connect(mapStateToProps)(ResourceCurrencyChart);
