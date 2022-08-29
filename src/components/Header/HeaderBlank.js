import React, { Component } from "react";
import { withRouter } from "react-router";
import "./HeaderBlank.less";

class HeaderBlank extends Component {
  constructor() {
    super()
    this.state = {
      isHome: false
    }
  }
  componentDidMount() {
    this.setState({ isHome: this.props.pathname === '/' })
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps && prevProps.location.pathname !== this.props.pathname) {
      if ((this.props.location.pathname === '/') !== this.state.isHome) {
        this.setState({ isHome: this.props.location.pathname === '/' })
      }
    }
  }
  render() {
    return (
      <div className={"header-blank " + (this.state.isHome && 'only-menu')} />
    );
  }
}
export default withRouter(HeaderBlank)