import React, { Component }  from "react";
export default class HeaderBlank extends Component {
    render() {
        if (location.pathname === '/') {
            return ('');
        }
        return (
            <div style={{
                height: 64 + 16,
                width: 100
            }}>
            </div>
        );
    }
}
