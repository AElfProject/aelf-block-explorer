/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-09 18:52:15
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-10-31 20:36:10
 * @Description: file content
 */
import React, { PureComponent } from 'react';
import { Row, Col, Tooltip, Icon, Statistic, Spin } from 'antd';

import './index.less';

const { Countdown } = Statistic;
const clsPrefix = 'statistical-data';

class StatisticalData extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      arr: null
    };
  }

  componentDidMount() {
    const { data } = this.props;

    this.setState({
      arr: Object.values(data)
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { data } = this.props;

    if (prevProps.data !== data) {
      this.setState({
        arr: Object.values(data)
      });
    }
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
    const { spinning, style, tooltip, inline } = this.props;
    const { arr } = this.state;
    if (!arr) return null;

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
      <section style={style}>
        <Spin spinning={spinning}>
          {/* <Row> */}
          <section
            className={`${clsPrefix}-container card-container ${
              inline ? 'inline-style' : ''
            }`}
          >
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
                    value={item.num}
                  />
                )
              );
            })}
            {/* </Row> */}
            {tooltip ? (
              <Tooltip title={tooltip}>
                <Icon style={{ fontSize: 20 }} type='exclamation-circle' />
              </Tooltip>
            ) : null}
          </section>
        </Spin>
      </section>
    );
  }
}

StatisticalData.defaultProps = {
  spinning: false
};

export default StatisticalData;
