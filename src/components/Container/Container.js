import React, { Component } from 'react';
import { Layout } from 'antd';

require('./container.styles.less');

const { Content } = Layout;

export default class Container extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { children } = this.props;
    return <Content className="body-container">{children}</Content>;
  }
}
