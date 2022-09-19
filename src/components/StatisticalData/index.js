/*
 * @Author: Alfred Yang
 * @Github: https://github.com/cat-walk
 * @Date: 2019-09-09 18:52:15
 * @LastEditors: Alfred Yang
 * @LastEditTime: 2019-12-10 17:00:44
 * @Description: file content
 */
import React, { PureComponent } from 'react';
import { Tooltip, Statistic, Spin } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
require('./index.less');

const { Countdown } = Statistic;
const clsPrefix = 'statistical-data';

const arrFormate = function (arr) {
  // const arr = new Array(arrInput);
  switch (arr.length) {
    case 4:
      // eslint-disable-next-line no-return-assign, no-param-reassign
      arr.forEach((item, index) => (item.span = 8 - 4 * (index % 2)));
      break;
    default:
      // eslint-disable-next-line no-return-assign, no-param-reassign
      arr.forEach((item) => (item.span = 24 / arr.length));
      break;
  }
  return arr;
};

export default class StatisticalData extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      arr: null,
    };
  }

  componentDidMount() {
    const { data } = this.props;
    this.setState({
      arr: Object.values(data),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { data } = this.props;

    if (prevProps.data !== data) {
      this.setState({
        arr: Object.values(data),
      });
    }
  }

  handleFinish(id) {
    const { arr } = this.state;
    // todo: limit the data's type to object
    const countdown = arr.find((item) => item.id === id);
    countdown.num = Date.now() + countdown.resetTime;
    this.setState({ arr: [...arr] });
    // todo: update the current term number at the same time
  }

  renderList(arr) {
    return arr.map((item, index) => {
      const number = item.num;
      if (item.isRender) {
        return item.num;
      }
      return item.isCountdown ? (
        <Countdown
          key={index}
          title={item.title}
          value={item.num || 0}
          format="D day HH : mm : ss "
          onFinish={() => {
            this.handleFinish(item.id);
          }}
        />
      ) : (
        <Statistic key={index} title={item.title} value={isNaN(parseInt(number, 10)) ? 0 : number} />
      );
    });
  }

  render() {
    const { spinning, style, tooltip, inline } = this.props;
    const { arr } = this.state;
    if (!arr) return null;

    const arrFormatted = arrFormate(arr);
    const listHTML = this.renderList(arrFormatted);

    return (
      <section style={style}>
        <Spin spinning={spinning}>
          <section className={`${clsPrefix}-container card-container ${inline ? 'inline-style' : ''}`}>
            {tooltip ? (
              <Tooltip title={tooltip}>
                <ExclamationCircleOutlined style={{ fontSize: 20 }} />
              </Tooltip>
            ) : null}
            {listHTML}
          </section>
        </Spin>
      </section>
    );
  }
}

StatisticalData.defaultProps = {
  spinning: false,
};
