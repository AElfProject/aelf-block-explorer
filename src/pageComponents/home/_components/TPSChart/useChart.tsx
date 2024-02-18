import React, { useEffect, useRef, memo } from 'react';

import echarts from './echarts.config';

import { ECBasicOption, ECElementEvent, EChartsType } from 'echarts/types/dist/shared';
import { useEffectOnce } from 'react-use';

interface IProps {
  option: ECBasicOption;
  clickHandler?: (params: ECElementEvent) => void;
  className: string;
}
const ReactEchartComponent = (props: IProps) => {
  const { option: chartOptions, clickHandler, className } = props;
  const chartRef = useRef<EChartsType>();
  const dom = useRef<any>(null);

  useEffectOnce(() => {
    chartRef.current = echarts.init(dom.current);
  });

  useEffect(() => {
    if (!chartOptions) {
      return;
    }
    if (!chartRef.current) {
      return;
    }
    clickHandler && chartRef.current.on('click', clickHandler);
    chartRef.current?.setOption(chartOptions);
    window.addEventListener('resize', () => {
      chartRef.current?.resize();
    });
  }, [chartOptions, clickHandler]);

  return <div className={className} ref={dom}></div>;
};

export default memo(ReactEchartComponent);
