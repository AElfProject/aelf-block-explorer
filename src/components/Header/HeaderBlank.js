import React, { Component } from "react";
import "./HeaderBlank.less";
import { withRouter } from "../../routes/utils";

class HeaderBlank extends Component {
  constructor() {
    super()
    this.state = {
      onlyMenu: false
    }
  }

  componentDidMount() {
    const { location } = this.props
    this.setState({
      onlyMenu: (location.pathname === '/'
        || location.pathname.includes("/search-"))
    })
  }

  componentDidUpdate(prevProps) {
    const { pathname, location } = this.props
    const { onlyMenu } = this.state
    if (prevProps && prevProps.location.pathname !== pathname) {
      if ((location.pathname === '/' || location.pathname.includes("/search-")) !== onlyMenu) {
        this.setState({
          onlyMenu: (location.pathname === '/'
            || location.pathname.includes("/search-"))
        })
      }
    }
  }

  render() {
    const { onlyMenu } = this.state

    return (
      <div className={`header-blank ${onlyMenu && 'only-menu'}`} />
    );
  }
}
export default withRouter(HeaderBlank);
