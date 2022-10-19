/**
 * @file Svg
 * @author zhouminghui
 */

import React, { CSSProperties, MouseEventHandler, PureComponent } from 'react';
import svgList from 'assets/svgs';

interface IProps {
  style: CSSProperties;
  className: string;
  icon: string;
  click: MouseEventHandler;
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
