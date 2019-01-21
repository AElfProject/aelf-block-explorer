/**
 * @file Svg
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import svgList from '../../assets/svgList';

export default class Svg extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            style: this.props.style
        };
    }

    render() {
        let icon = this.props.icon;
        let svg = svgList[icon];

        return (
            <div
                style={this.state.style}
                className={this.props.className}
                onClick={this.props.click}
                dangerouslySetInnerHTML={{__html: svg}}
                {...this.props}
            ></div>
        );
    }
}
