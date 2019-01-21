/**
 * @file Button
 * @author zhouminghui
 * 可复用按钮
*/

import React, {PureComponent} from 'react';
import './Button.less';

export default class Button extends PureComponent {
    render() {
        return (
            <div className='AElf-button' onClick={this.props.click} style={this.props.style}>
                {this.props.title}
            </div>
        );
    }
}
