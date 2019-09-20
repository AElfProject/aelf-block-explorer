/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-09 18:52:15
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-18 14:36:11
 * @Description: file content
 */
import React from 'react';
import { Row, Col, Tooltip, Icon, Statistic } from 'antd';

import './index.less';

const clsPrefix = 'statistical-data';

function StatisticalData(props) {
  let { data } = props;
  // todo: Is isArray accurate enough?
  // todo: Optimize the following line
  if (typeof data === 'object' && !Array.isArray(data)) {
    data = Object.values(data);
  }

  switch (data.length) {
    case 4:
      // eslint-disable-next-line no-return-assign, no-param-reassign
      data.forEach((item, index) => (item.span = 8 - 4 * (index % 2)));
      break;
    default:
      // eslint-disable-next-line no-return-assign, no-param-reassign
      data.forEach(item => (item.span = 24 / data.length));
      break;
  }

  return (
    <section className={`${clsPrefix}-container card-container `}>
      {/* <Row> */}
      {data.map(item => {
        return (
          // <Col span={item.span} key={item.title}>
          //   <p className={`${clsPrefix}-words`}>{item.title}</p>
          //   <p className={`${clsPrefix}-number`}>{item.num}</p>
          // </Col>
          <Statistic key={item.title} title={item.title} value={item.num || '...'} />
        );
      })}
      {/* </Row> */}
      <Tooltip title='竞选周期为7天，届之间无间隔；节点数为当前BP和候选节点总数；投票数量为竞选以来投票数量总和；分红池包括为BP节点打包区块奖励+80%gas费+80%侧链收益。'>
        <Icon style={{ fontSize: 20 }} type='exclamation-circle' />
      </Tooltip>
    </section>
  );
}
export default StatisticalData;
