/*
 * @Author: AbigailDeng Abigail.deng@ienyan.com
 * @Date: 2022-09-29 17:14:01
 * @LastEditors: AbigailDeng Abigail.deng@ienyan.com
 * @LastEditTime: 2022-10-28 15:14:56
 * @FilePath: /aelf-block-explorer/src/components/plugin/index.tsx
 * @Description: download plugin for proposal
 */

import React from 'react';
import { Row, Col } from 'antd';
require('./index.less');

/* eslint-disable max-len */

const Plugin = () => (
  <div className="DownloadPlugins">
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
              rel="noreferrer noopener"
              href="https://chrome.google.com/webstore/detail/aelf-explorer-extension-d/mlmlhipeonlflbcclinpbmcjdnpnmkpf">
              Download
            </a>
          </div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <div className="Step-con">2. Create a common wallet</div>
        </Col>
        <Col xs={24} sm={24} md={24} lg={8} xl={8}>
          <div className="Step-con">3. Take a try!</div>
        </Col>
      </Row>
    </div>
  </div>
);

export default Plugin;
