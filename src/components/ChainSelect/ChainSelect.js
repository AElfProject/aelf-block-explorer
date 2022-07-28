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
import CHAIN_STATE  from '../../../config/configCMS.json';
import './ChainSelect.styles.less';
import {CHAIN_ID} from "../../constants";
import { getCMSDelayRequest } from '../../utils/getCMS';

const CHAINS_LIST = CHAIN_STATE.chain || [];

const Option = Select.Option;
export default class ChainSelect extends Component {

    constructor() {
        super();
        this.state = {
            chainList: CHAINS_LIST
        }

    }

    async fetch() {
        // fetch
        const data = await getCMSDelayRequest();
        if(data && data.chain) this.setState({
            chainList: data.chain
        });
    }

    componentDidMount() {
        this.fetch();
    }

    changeChain(chainId) {
        const chainInfo = this.state.chainList.find(item=> item.chainId === chainId);
        if(chainInfo.chainsLink) window.location = chainInfo.chainsLink;
    }

    renderOptions() {
        const chainIdHTML = this.state.chainList.map(item => {
            return <Option
                className='common-select-option-wrapper chain-select-option'
                key={item.chainsLink + Math.random()}
                value={item.chainId || ''}
            >
                {item.chainsLinkName.replace('chain', '')}
            </Option>;
        });
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
                onChange={this.changeChain}>
                  {optionsHTML}
              </Select>
          </div>
        );
    }
}
