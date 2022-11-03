import React from 'react';
import isEmpty from 'lodash/isEmpty';
// import the core library.
import ReactEchartsCore from 'echarts-for-react/lib/core';

// then import echarts modules those you have used manually.
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/line';
// import 'echarts/lib/chart/pie';
// import 'echarts/lib/chart/scatter';
// import 'echarts/lib/chart/radar';

// import 'echarts/lib/chart/map';
// import 'echarts/lib/chart/treemap';
// import 'echarts/lib/chart/graph';
// import 'echarts/lib/chart/gauge';
// import 'echarts/lib/chart/funnel';
// import 'echarts/lib/chart/parallel';
// import 'echarts/lib/chart/sankey';
// import 'echarts/lib/chart/boxplot';
// import 'echarts/lib/chart/candlestick';
// import 'echarts/lib/chart/effectScatter';
import 'echarts/lib/chart/lines';
// import 'echarts/lib/chart/heatmap';

// import 'echarts/lib/component/graphic';
// import 'echarts/lib/component/grid';
// import 'echarts/lib/component/legend';
import 'echarts/lib/component/tooltip';
// import 'echarts/lib/component/polar';
// import 'echarts/lib/component/geo';
// import 'echarts/lib/component/parallel';
// import 'echarts/lib/component/singleAxis';
// import 'echarts/lib/component/brush';

import 'echarts/lib/component/title';

// import 'echarts/lib/component/dataZoom';
// import 'echarts/lib/component/visualMap';

// import 'echarts/lib/component/markPoint';
// import 'echarts/lib/component/markLine';
// import 'echarts/lib/component/markArea';

// import 'echarts/lib/component/timeline';
// import 'echarts/lib/component/toolbox';

// import 'zrender/lib/vml/vml';
import { maxBy, reverse } from 'lodash';
import { format, get } from '../../utils';
// echart theme
import '../../assets/lib/shine';

// The usage of ReactEchartsCore are same with above.
export default class TradeChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false,
    };
  }

  async componentDidMount() {
    this.setState({
      loading: true,
    });

    try {
      const res = await get('/market/history/trade', {
        symbol: 'elfbtc',
        size: 200,
      });

      const data = isEmpty(res) ? [] : res.data;

      this.setState({
        data,
        loading: false,
      });
    } catch (e) {}
  }

  getOption() {
    const { data } = this.state;
    const BASE_OPTIONS = {
      // Make gradient line here
      visualMap: [
        {
          show: false,
          type: 'continuous',
          min: 1,
          max: maxBy(data.map(({ data }) => data[0].amount)),
        },
      ],
      title: [
        {
          left: 'center',
          text: '1小时交易记录',
        },
      ],
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          console.log(params);
          return `成交量: ${params.data[0].data[0].account} <br /> 成交方向: ${
            params.data[0].data[0].direction
          }`;
        },
      },
      xAxis: [
        {
          data: reverse(data.map(({ ts }) => format(ts, 'HH:mm:ss'))),
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: '成交量',
          type: 'line',
          showSymbol: false,
          smooth: true,
          data: data.map(({ data }) => data[0].amount),
        },
      ],
    };

    return BASE_OPTIONS;
  }

  render() {
    const { loading } = this.state;
    return (
      <ReactEchartsCore
        echarts={echarts}
        showLoading={loading}
        option={this.getOption()}
        notMerge
        lazyUpdate
      />
    );
  }
}
