/**
 * @file
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Row, Col} from 'antd';
import Button from '../Button/Button';
import Svg from '../Svg/Svg';
import './DownloadPlugins.less';

export default class DownloadPlugins extends PureComponent {

    getDownload() {
        console.log('下载');
    }

    render() {
        return (
            <div className='DownloadPlugins'>
                {/* <div className='Tips'>为避免每次操作时填写私钥信息，你可以通过插件来使用这些工具（安装插件后仍然显示这些信息，请尝试刷新操作）</div> */}
                <div className='Tips'>
                To avoid filling in the private key information for each operation, you can
                use these tools through plug-ins(the information is still displayed after the extension is installed,
                please try refreshing the operation)
                </div>
                <div className='step'>
                <Row>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8} >
                        <div className='Step-con'>
                            1.Install extension
                            <Button title='download' display='inline-block' onClick={this.getDownload}/>
                        </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <div className='Step-con'>2.Unlock extension, set key</div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                        <div className='Step-con'>3.Start using</div>
                    </Col>
                </Row>
                </div>
            </div>
        );
    }
}
