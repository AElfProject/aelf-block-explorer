/**
 * @file ToolBar.js
 * @author huangzongzhe
*/
/* eslint-disable fecs-camelcase */
import React, {
    Component
} from 'react';

import {
    Select
} from 'antd';
import Cookies from 'js-cookie';

import './ChainSelect.styles.less';

const Option = Select.Option;

export default class ChainSelect extends Component {

    changeChain(chainId) {
        const nodesInfoInStorage = JSON.parse(localStorage.getItem('nodesInfo'));
        nodesInfoInStorage.find(item => {
            if (item.chain_id === chainId) {
                const {
                    contract_address,
                    chain_id
                } = item;
                Cookies.set('aelf_ca_ci', contract_address + chain_id);
                localStorage.setItem('currentChain', JSON.stringify(item));
                window.location.reload();
                return;
            }
        });
    }

    renderOptions() {
        const nodesInfoInStorage = JSON.parse(localStorage.getItem('nodesInfo'));
        const chainIdHTML = nodesInfoInStorage.map(item => {
            const {
                chain_id
            } = item;

            return <Option
                    key={chain_id}
                    value={chain_id}
                >
                {chain_id}
            </Option>;
        });
        return chainIdHTML;
    }

    render() {
        const currentChain = JSON.parse(localStorage.getItem('currentChain'));
        const defaultValue = currentChain.chain_id;
        const optionsHTML = this.renderOptions();
        return (
            <div className="chain-select-container">
                <Select
                    defaultValue={defaultValue}
                    style={{width: 120}}
                    onChange={this.changeChain}>
                    {optionsHTML}
                </Select>
            </div>
        );
    }
}
