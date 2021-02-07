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
import {CHAINS_LINK, CHAINS_LINK_NAMES} from '../../../config/config';

import './ChainSelect.styles.less';
import {CHAIN_ID} from "../../constants";

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
        const defaultValue = CHAIN_ID;
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
