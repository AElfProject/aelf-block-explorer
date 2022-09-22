import React, { Component } from 'react';
require('./HeaderBlank.less');
import { withRouter } from 'next/router';
class HeaderBlank extends Component {
  constructor() {
    super();
    this.state = {
      isHome: false,
    };
  }
  componentDidMount() {
    this.setState({
      isHome: window.location.pathname === '/' || window.location.pathname.includes('/search-'),
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps && prevProps.router.pathname !== this.props.router.pathname) {
      if ((window.location.pathname === '/' || this.props.router.pathname.includes('/search-')) !== this.state.isHome) {
        this.setState({ isHome: window.location.pathname === '/' });
      }
    }
  }
  render() {
    return <div className={'header-blank ' + (this.state.isHome && 'only-menu')} />;
  }
}
export default withRouter(HeaderBlank);
