/**
 * @file ResourceCurrencyChart
 * @author zhouminghui
 * echarts
 */

import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Icon, Tabs, Button } from 'antd';

import ReactEchartsCore from 'echarts-for-react/lib/core';
import echarts from 'echarts/lib/echarts';
import { get } from '../../../../../utils';
import { RESOURCE_CURRENCY_CHART_FETCH_INTERVAL, RESOURCE_TURNOVER } from '../../../../../constants';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/candlestick';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/toolbox';
import './ResourceCurrencyChart.less';

function calculateMA(dayCount, data) {
  const result = [];
  const { length } = data;
  for (let i = 0; i < length; i++) {
    if (i < dayCount) {
      result.push('-');
      continue;
    }
    let sum = 0;
    for (let j = 0; j < dayCount; j++) {
      const { prices } = data[i - j];
      sum += prices.length === 0 ? 0 : +prices[prices.length - 1];
    }
    result.push((sum / dayCount).toFixed(2));
  }
  return result;
}

function resortPrices(prices) {
  if (prices.length === 0) {
    return prices;
  }
  const open = prices[0];
  const end = prices[prices.length - 1];
  const sorted = [...prices].sort((a, b) => a - b);
  const lowest = sorted[0];
  const highest = sorted[sorted.length - 1];
  return [
    open,
    end,
    lowest,
    highest,
  ];
}

function handleDataList(list = [], interval, length) {
  let dates = [];
  let volumes = [];
  let prices = [];
  list.forEach((item, index) => {
    dates.push(echarts.format.formatTime('yyyy-MM-dd hh:mm', item.date));
    const resortedPrices = resortPrices(item.prices);
    const preResortedPrices = prices[index - 1 || 0] || resortedPrices;
    volumes.push([index, item.volume, resortedPrices[0] - preResortedPrices[preResortedPrices.length - 1]]);
    prices.push(resortedPrices);
  });
  if (dates.length < length) {
    let lastEnd = dates[dates.length - 1];
    lastEnd = new Date(lastEnd).valueOf();
    const emptyList = Array.from(new Array(length - dates.length)).map(() => 1);
    dates = [
      ...dates,
      ...emptyList
        .fill(1)
        .map((_, i) => echarts.format.formatTime('yyyy-MM-dd hh:mm:ss', interval * (i + 1) + lastEnd)),
    ];
    volumes = [
      ...volumes,
      ...emptyList
        .map((_, i) => [i + volumes.length, '-', 0]),
    ];
    prices = [
      ...prices,
      ...emptyList
        .map(() => []),
    ];
  }
  return {
    prices,
    volumes,
    dates,
  };
}

function getMAData(list) {
  const maList = [5, 10, 20, 30];
  const filteredMa = maList.filter((v) => v <= list.length);
  const legend = filteredMa.map((v) => `MA${v}`);
  const series = filteredMa.map((v, i) => {
    const name = legend[i];
    const ma = calculateMA(v, list);
    return {
      name,
      type: 'line',
      data: ma,
      smooth: true,
      showSymbol: false,
      lineStyle: {
        width: 1,
      },
    };
  });
  return {
    legend,
    series,
  };
}

const colorList = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];

const timeZone = (new Date().getTimezoneOffset()) / 60 * -1;

const QUERY_RANGE = 40;

class ResourceCurrencyChart extends PureComponent {
  constructor(props) {
    super(props);
    this.getEchartDataTime = null;
    this.intervalTimeList = [
      1000 * 60 * 5, // 5m
      1000 * 60 * 30, // 30m
      1000 * 60 * 60, // 1h
      1000 * 60 * 60 * 4, // 4h
      1000 * 60 * 60 * 24, // 1d
      1000 * 60 * 60 * 24 * 7, // 7d
    ];
    this.state = {
      loading: false,
      buttonIndex: 0,
      intervalTime: 5 * 60 * 1000, // 5m
      list: [],
      maxValue: null,
    };
    this.typeChange = this.typeChange.bind(this);
  }

  componentDidMount() {
    this.echartStyle = {
      height: 540,
    };
    this.getEchartData();
  }

  componentDidUpdate(prevProps, prevStates) {
    // 时间维度
    if (prevStates.buttonIndex !== this.state.buttonIndex) {
      clearTimeout(this.getEchartDataTime);
      this.getEchartData();
    }
    if (prevProps.currentResourceIndex !== this.props.currentResourceIndex) {
      clearTimeout(this.getEchartDataTime);
      this.getEchartData();
    }
  }

  async getEchartData() {
    const {
      currentResourceType,
    } = this.props;
    const { intervalTime, buttonIndex } = this.state;
    this.setState({
      loading: true,
    });

    try {
      const list = await get(RESOURCE_TURNOVER, {
        range: QUERY_RANGE,
        timeZone,
        interval: intervalTime,
        type: currentResourceType,
      });

      this.setState({
        list,
        loading: false,
      });
      this.props.getEchartsLoading();
      this.getEchartDataTime = setTimeout(() => {
        this.getEchartData();
      }, RESOURCE_CURRENCY_CHART_FETCH_INTERVAL);
    } catch {
      this.setState({
        loading: false,
      });
      this.getEchartDataTime = setTimeout(() => {
        this.getEchartData();
      }, RESOURCE_CURRENCY_CHART_FETCH_INTERVAL);
    }
  }

  componentWillUnmount() {
    clearTimeout(this.getEchartDataTime);
  }

  handleButtonClick(index) {
    this.setState({
      buttonIndex: index,
      intervalTime: this.intervalTimeList[index],
    });
  }

  getOption() {
    const { list, buttonIndex } = this.state;
    const { currentResourceType } = this.props;
    const {
      dates,
      volumes,
      prices,
    } = handleDataList(list, this.intervalTimeList[buttonIndex], QUERY_RANGE);
    const {
      legend,
      series,
    } = getMAData(list);
    return {
      animation: false,
      color: colorList,
      title: {
        left: 'center',
        text: 'Resource Trade',
      },
      legend: {
        top: 30,
        data: [currentResourceType, ...legend],
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
      },
      axisPointer: {
        link: [{
          xAxisIndex: [0, 1],
        }],
      },
      grid: [{
        left: 40,
        right: 20,
        top: 110,
        height: 300,
      }, {
        left: 40,
        right: 20,
        height: 60,
        top: 470,
      }],
      xAxis: [
        {
          type: 'category',
          data: dates,
          boundaryGap: true,
          axisLine: { lineStyle: { color: '#777' } },
          axisLabel: {
            formatter(value) {
              if (buttonIndex >= 4) {
                return echarts.format.formatTime('MM-dd', value);
              }
              return echarts.format.formatTime('MM-dd\nhh:mm', value);
            },
          },
          axisTick: {
            show: true,
            alignWithLabel: true,
          },
          min: 'dataMin',
          max: 'dataMax',
          axisPointer: {
            show: true,
          },
        },
        {
          type: 'category',
          gridIndex: 1,
          data: dates,
          scale: true,
          boundaryGap: true,
          splitLine: { show: false },
          axisLabel: { show: false },
          axisTick: {
            show: false,
            alignWithLabel: true,
          },
          axisLine: { lineStyle: { color: '#777' } },
          splitNumber: 20,
          min: 'dataMin',
          max: 'dataMax',
        },
      ],
      yAxis: [{
        scale: true,
        splitNumber: 2,
        axisLine: { lineStyle: { color: '#777' } },
        splitLine: { show: true },
        axisTick: { show: false },
        min(value) {
          return Math.min(value.min, 0);
        },
        max(value) {
          return (value.max * 1.2).toFixed(3);
        },
        axisLabel: {
          inside: false,
          formatter: '{value}\n',
        },
      }, {
        scale: true,
        gridIndex: 1,
        splitNumber: 2,
        axisLabel: { show: false },
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      }],
      series: [
        {
          name: 'Volume',
          type: 'bar',
          xAxisIndex: 1,
          yAxisIndex: 1,
          itemStyle: {
            color(params) {
              return params.data[2] >= 0 ? '#05ac90' : '#d34a64';
            },
          },
          data: volumes,
        },
        {
          type: 'candlestick',
          name: currentResourceType,
          data: prices,
          itemStyle: {
            color: '#05ac90',
            color0: '#d34a64',
            borderColor: '#05ac90',
            borderColor0: '#d34a64',
          },
        },
        ...series,
      ],
    };
  }

  typeChange(activeKey) {
    const {
      getMenuClick,
    } = this.props;
    getMenuClick(activeKey);
  }

  selectButtonHTML() {
    const buttons = [
      '5 Min',
      '30 Min',
      '1 Hour',
      '4 Hours',
      '1 Day',
      '1 Week',
    ];
    const { buttonIndex } = this.state;
    const buttonsHTML = buttons.map((item, index) => (
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
    ));
    return buttonsHTML;
  }

  render() {
    const {
      list,
    } = this.props;
    const selectButton = this.selectButtonHTML();

    return (
      <div className="resource-currency-chart">
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
            {list.map((v) => (
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
            notMerge
            lazyUpdate
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  ...state.common,
});

export default connect(mapStateToProps)(ResourceCurrencyChart);
