/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-09-29 17:14:01
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-28 15:03:45
 * @FilePath: /aelf-block-explorer/src/components/DownloadPlugins/DownloadPlugins.tsx
 * @Description: show `download and install NightElf browser extension` message
 */
import React, { CSSProperties, PureComponent } from 'react';
import { Row, Col } from 'antd';
require('./DownloadPlugins.less');
interface IProps {
  style?: CSSProperties;
}
export default class DownloadPlugins extends PureComponent<IProps> {
  getDownload() {
    console.log('下载');
  }

  render() {
    const { style } = this.props;
    return (
      <div className="DownloadPlugins" style={style}>
        <div className="Tips">
          Please download and install NightElf browser extension. Please don’t forget to refresh the page : )
        </div>
        <div className="step">
          <Row>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div className="Step-con">
                1.Install the extension
                <a
                  className="download-button"
                  target="_blank"
                  href="https://chrome.google.com/webstore/search/AELF"
                  rel="noreferrer">
                  download
                </a>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div className="Step-con">2.Create a common wallet</div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={8} xl={8}>
              <div className="Step-con">3.Try to vote!</div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
