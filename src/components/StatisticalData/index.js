/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-09 18:52:15
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-09-20 19:27:17
 * @Description: file content
 */
import React, { PureComponent } from 'react';
import { Row, Col, Tooltip, Icon, Statistic } from 'antd';

import './index.less';

const { Countdown } = Statistic;
const clsPrefix = 'statistical-data';

class StatisticalData extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      arr: Object.values(props.data)
    };
  }

  handleFinish(id) {
    const { arr } = this.state;
    // todo: limit the data's type to object
    const countdown = arr.find(item => item.id === id);
    countdown.num = Date.now() + countdown.resetTime;
    this.setState({ arr: [...arr] });
    // todo: update the current term number at the same time
  }

  render() {
    const { arr } = this.state;

    switch (arr.length) {
      case 4:
        // eslint-disable-next-line no-return-assign, no-param-reassign
        arr.forEach((item, index) => (item.span = 8 - 4 * (index % 2)));
        break;
      default:
        // eslint-disable-next-line no-return-assign, no-param-reassign
        arr.forEach(item => (item.span = 24 / arr.length));
        break;
    }

    return (
      <section className={`${clsPrefix}-container card-container `}>
        {/* <Row> */}
        {arr.map(item => {
          return (
            // <Col span={item.span} key={item.title}>
            //   <p className={`${clsPrefix}-words`}>{item.title}</p>
            //   <p className={`${clsPrefix}-number`}>{item.num}</p>
            // </Col>
            item.isCountdown ? (
              <Countdown
                key={Math.random()}
                title={item.title}
                value={item.num || 0}
                format='D day H : m : s '
                onFinish={() => {
                  console.log('finished');
                  this.handleFinish(item.id);
                }}
              />
            ) : (
              <Statistic
                key={Math.random()}
                title={item.title}
                value={item.num || '...'}
              />
            )
          );
        })}
        {/* </Row> */}
        <Tooltip title='竞选周期为7天，届之间无间隔；节点数为当前BP和候选节点总数；投票数量为竞选以来投票数量总和；分红池包括为BP节点打包区块奖励+80%gas费+80%侧链收益。'>
          <Icon style={{ fontSize: 20 }} type='exclamation-circle' />
        </Tooltip>
      </section>
    );
  }
}
export default StatisticalData;