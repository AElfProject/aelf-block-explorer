/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-09-29 10:12:13
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-28 15:22:48
 * @FilePath: /aelf-block-explorer/src/components/Svg/Svg.tsx
 * @Description: show svg
 */

import React, { CSSProperties, MouseEventHandler, PureComponent } from 'react';
import svgList from 'assets/svgs';

interface IProps {
  style?: CSSProperties;
  className: string;
  icon: string;
  click?: MouseEventHandler;
}
export default class Svg extends PureComponent<IProps> {
  constructor(props) {
    super(props);
  }

  render() {
    const { icon } = this.props;
    const svg = svgList[icon];

    return <div onClick={this.props.click} dangerouslySetInnerHTML={{ __html: svg }} {...this.props} />;
  }
}
