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
import {ADDRESS_INFO, CHAINS_LINK, CHAINS_LINK_NAMES} from '../../../config/config';

import './ChainSelect.styles.less';

const Option = Select.Option;
export default class ChainSelect extends Component {

    changeChain(chainId) {
        window.location = CHAINS_LINK[chainId];
    }

    renderOptions() {
        const chainIdHTML = Object.keys(CHAINS_LINK).map(item => {
            return <Option
              key={item + Math.random()}
              value={item}
            >
                {CHAINS_LINK_NAMES[item].replace('chain', '')}
            </Option>;
        });
        return chainIdHTML;
    }

    render() {
        const defaultValue = ADDRESS_INFO.CURRENT_CHAIN_ID;
        const optionsHTML = this.renderOptions();

        return (
          <div className="chain-select-container">
              <Select
                className="chain-select"
                defaultValue={defaultValue}
                onChange={this.changeChain}>
                  {optionsHTML}
              </Select>
          </div>
        );
    }
}
