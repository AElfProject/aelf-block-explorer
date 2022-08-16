import React, { Component } from "react";
import "./HeaderBlank.less";
import { withRouter } from "../../routes/utils";
class HeaderBlank extends Component {
  render() {
    if (location.pathname === "/") {
      return "";
    }
    return <div className='header-blank' />;
  }
}
export default withRouter(HeaderBlank);
