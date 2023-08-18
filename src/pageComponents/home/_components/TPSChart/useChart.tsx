import React, { useEffect, useRef, memo } from 'react';

import echarts from './echarts.config';

import { ECBasicOption, ECElementEvent } from 'echarts/types/dist/shared';

interface IProps {
  option: ECBasicOption;
  clickHandler?: (params: ECElementEvent) => void;
  className: string;
}
const ReactEchartComponent = (props: IProps) => {
  const { option: chartOptions, clickHandler, className } = props;

  const dom = useRef<any>(null);

  useEffect(() => {
    if (chartOptions) {
      const chart = echarts.init(dom.current);
      clickHandler && chart.on('click', clickHandler);
      chart.setOption(chartOptions);
      window.addEventListener('resize', () => {
        chart.resize();
      });
    }
  }, [chartOptions, clickHandler]);

  return <div className={className} ref={dom}></div>;
};

export default memo(ReactEchartComponent);
