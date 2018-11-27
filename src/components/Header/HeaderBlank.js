import React, { Component }  from "react";
import "./HeaderBlank.less";

export default class HeaderBlank extends Component {
    render() {
        if (location.pathname === '/') {
            return ('');
        }
        return (
            <div className="header-blank">
            </div>
        );
    }
}
