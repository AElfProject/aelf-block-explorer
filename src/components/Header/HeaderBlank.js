import React, { Component } from "react";
import { withRouter } from "react-router";
import { isPhoneCheck } from "../../utils/deviceCheck";
import "./HeaderBlank.less";

class HeaderBlank extends Component {
  constructor() {
    super()
    this.state = {
      isHome: false
    }
  }
  componentDidMount() {
    this.setState({ isHome: !!isPhoneCheck() })
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps && prevProps.location.pathname !== this.props.location.pathname) {
      if (this.props.location.pathname === '/') {
        this.setState({ isHome: true })
      } else {
        this.setState({ isHome: false })
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