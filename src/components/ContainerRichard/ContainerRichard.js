/**
 * @file
 * @author huangzongzhe
*/


import React, {Component} from 'react';

import './ContainerRichard.less';


export default class ContainerRichard extends Component {

    render() {

        // large | small
        const contentClass = `conri-center-content-${this.props.type}`;

        return (
            <div className='conri-container'>
                <div className='conri-top-border'>
                    <div className='conri-horizontal-line'></div>
                </div>
                <div className='conri-center'>
                    <div className='conri-center-left'>
                        <div className='conri-vertical-line'></div>
                        <div className='conri-vertical-line'></div>
                    </div>
                    <div className={'conri-center-content ' + contentClass}>
                        {this.props.children}
                    </div>
                    <div className='conri-center-right'>
                        <div className='conri-vertical-line'></div>
                        <div className='conri-vertical-line'></div>
                    </div>
                </div>
                <div className='conri-bottom-border'>
                    <div className='conri-horizontal-line'></div>
                </div>
            </div>
        );
    }
}
