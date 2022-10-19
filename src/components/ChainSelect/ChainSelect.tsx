/**
 * @file ToolBar.js
 * @author huangzongzhe
 */
import { Component } from 'react';
import { Select } from 'antd';
import config from 'constants/config/config';
require('./ChainSelect.styles.less');
interface IChainList {
  id: number;
  chainId: string;
  chainsLinkName: string;
  chainsLink: string;
}
interface IProps {
  chainList: IChainList[];
}
const { Option } = Select;
export default class ChainSelect extends Component<IProps> {
  constructor(props) {
    super(props);
  }

  changeChain(chainId) {
    const chainInfo = this.props.chainList.find((item) => item.chainId === chainId)!;
    if (chainInfo.chainsLink) window.location.href = chainInfo.chainsLink;
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
    const defaultValue = config.CHAIN_ID;
    const optionsHTML = this.renderOptions();

    return (
      <div className="chain-select-container">
        <Select
          aria-label="chain-select"
          className="chain-select common-select-wrapper"
          defaultValue={defaultValue}
          onChange={(v) => this.changeChain(v)}>
          {optionsHTML}
        </Select>
      </div>
    );
  }
}
