/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-09-29 10:12:13
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-28 14:57:56
 * @FilePath: /aelf-block-explorer/src/components/Container/Container.tsx
 * @Description: container for children components
 */

import React, { Component, PropsWithChildren } from 'react';
import { Layout } from 'antd';
require('./container.styles.less');

const { Content } = Layout;

export default class Container extends Component<PropsWithChildren> {
  constructor(props) {
    super(props);
  }

  render() {
    const { children } = this.props;
    return <Content className="body-container">{children}</Content>;
  }
}
