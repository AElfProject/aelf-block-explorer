/**
 * @file ToolBar.js
 * @author huangzongzhe
 */
import React, { Component } from 'react';
import { AppContext } from 'pages/_app';
import { Select } from 'antd';
require('./ChainSelect.styles.less');

const { Option } = Select;
export default class ChainSelect extends Component {
  constructor(props) {
    super(props);
  }

  changeChain(chainId) {
    const chainInfo = this.props.chainList.find((item) => item.chainId === chainId);
    if (chainInfo.chainsLink) window.location = chainInfo.chainsLink;
  }

  renderOptions() {
    const chainIdHTML = this.props.chainList.map((item) => (
      <Option
        className="common-select-option-wrapper chain-select-option"
        key={item.chainsLink + Math.random()}
        value={item.chainId || ''}>
        {item.chainsLinkName.replace('chain', '')}
      </Option>
    ));
    return chainIdHTML;
  }

  render() {
    const defaultValue = AppContext._currentValue.CHAIN_ID;
    const optionsHTML = this.renderOptions();

    return (
      <div className="chain-select-container">
        <Select
          className="chain-select common-select-wrapper"
          defaultValue={defaultValue}
          onChange={(v) => this.changeChain(v)}>
          {optionsHTML}
        </Select>
      </div>
    );
  }
}
