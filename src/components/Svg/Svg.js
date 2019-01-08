/**
 * @file Svg
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import svgList from '../../assets/svgList';

export default class Svg extends PureComponent {
    render() {

        let icon = this.props.icon;
        let svg = svgList[icon];

        return (
            <div
                style={{
                    height: 18,
                    width: 18,
                    display: 'inline-block',
                    verticalAlign: 'sub',
                    margin: '0 5px'
                }}
                onClick={this.props.click}
                dangerouslySetInnerHTML={{__html: svg}}
                {...this.props}
            ></div>
        );
    }
}
