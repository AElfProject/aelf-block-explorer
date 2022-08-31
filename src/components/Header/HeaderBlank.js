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
    const { location } = this.props
    this.setState({
      isHome: (location.pathname === '/'
        || location.pathname.includes("/search-"))
    })
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps && prevProps.location.pathname !== this.props.pathname) {
      if ((this.props.location.pathname === '/' || location.pathname.includes("/search-")) !== this.state.isHome) {
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