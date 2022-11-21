/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-09-30 20:43:59
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-28 15:13:26
 * @FilePath: /aelf-block-explorer/src/components/PageHead/HeaderBlank.tsx
 * @Description: occupy position except to '/' and '/search-'
 */
import React, { Component } from 'react';
import { withRouter, NextRouter } from 'next/router';
require('./HeaderBlank.less');
interface PropsDto {
  router: NextRouter;
}

class HeaderBlank extends Component<PropsDto, any> {
  constructor(props: PropsDto) {
    super(props);
    const isHome = props.router.asPath === '/' || props.router.asPath.includes('/search-');
    this.state = {
      isHome: isHome,
    };
  }
  componentDidMount() {
    this.setState({
      isHome: window.location.pathname === '/' || window.location.pathname.includes('/search-'),
    });
  }
  componentDidUpdate(prevProps: PropsDto) {
    if (prevProps && prevProps.router.asPath !== this.props.router.asPath) {
      if ((window.location.pathname === '/' || this.props.router.asPath.includes('/search-')) !== this.state.isHome) {
        this.setState({ isHome: window.location.pathname === '/' });
      }
    }
  }
  render() {
    return <div className={'header-blank ' + (this.state.isHome && 'only-menu')} />;
  }
}
export default withRouter(HeaderBlank);
