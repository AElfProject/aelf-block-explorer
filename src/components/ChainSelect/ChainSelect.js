/**
 * @file ToolBar.js
 * @author huangzongzhe
 */
import React, {
  Component
} from 'react';

import {
  Select
} from 'antd';
import './ChainSelect.styles.less';
import { CHAIN_ID } from '../../constants';

const { Option } = Select;
export default class ChainSelect extends Component {

  changeChain(chainId) {
    const { chainList } = this.props;
    const { chainsLink } = chainList.find((item) => item.chainId === chainId);
    if (chainsLink) window.location = chainsLink;
  }

  renderOptions() {
    const { chainList } = this.props;
    const chainIdHTML = chainList.map((item) => (
      <Option
        className="common-select-option-wrapper chain-select-option"
        key={item.chainsLink + Math.random()}
        value={item.chainId || ''}
      >
        {item.chainsLinkName.replace('chain', '')}
      </Option>
    ));
    return chainIdHTML;
  }

  render() {
    const defaultValue = CHAIN_ID;
    const optionsHTML = this.renderOptions();

    return (
      <div className="chain-select-container">
        <Select
          className="chain-select common-select-wrapper"
          defaultValue={defaultValue}
          onChange={(v) => this.changeChain(v)}
        >
          {optionsHTML}
        </Select>
      </div>
    );
  }
}
