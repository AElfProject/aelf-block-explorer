/**
 * @file Search.js
 * @author huangzongzhe
 */
import React, {
    PureComponent
} from 'react';
import {
    withRouter
} from "react-router-dom";
import { isAElfAddress } from '../../utils';
import {
    Input,
    Icon,
    message
} from 'antd';

import {
    get
} from '../../utils';

import './search.styles.less';
import { INPUT_STARTS_WITH_MINUS_TIP, INPUT_ZERO_TIP } from '@src/constants';

class Search extends PureComponent {

    state = {
        content: ''
    };

    emitEmpty = () => {
        this.userNameInput.focus();
        this.setState({
            content: ''
        });
    };

    onChangeUserName = e => {
        this.setState({
            content: e.target.value
        });
    };

    SEARCHRULES = {
        address(value, history) {
            history.push(`/address/${value}`);
        },
        async transaction(value, history) {
            let getTxsOption = {
                limit: 1,
                page: 0,
                block_hash: value
            };

            const blockInfo = await get('/block/transactions', getTxsOption);
            const isBlock = blockInfo.transactions && blockInfo.transactions.length;
            if (isBlock) {
                history.push(`/block/${value}`);
            }
            else {
                history.push(`/tx/${value}`);
            }
        },
        blockHeight(value, history) {
            let number = parseInt(value, 10);
            if (number == value) {
                history.push(`/block/${value}`);
            }
            return true;
        }
    }

    handleSearch = e => {
        let value = e.target && e.target.value || e.searchValue || '';
        value = value.trim();
        if (!value.trim()) {
            return;
        }

        if (value.indexOf('_') > 0) {
            value = value.split('_')[1];
        }

        // AElf.utils;
        // value = ;

        const length = value.length;
        const isTxid = [64];

        // address.length === 38/66 && address.match(/^0x/)
        // search
        // 0. 0x
        // 1. transaction 66
        // 2. block   66
        // 3. address length=38
        if(`${value}`.startsWith('-')){
            message.error(INPUT_STARTS_WITH_MINUS_TIP);
            return;
        }
        if(+value === 0){
            message.error(INPUT_ZERO_TIP);
            return;
        }

        if (isAElfAddress(value)) {
            const address = AElf.utils.encodeAddressRep(AElf.utils.decodeAddressRep(value));
            this.SEARCHRULES.address(address, this.props.history);
        }
        else if (isTxid.includes(length)) {
            this.SEARCHRULES.transaction(value, this.props.history);
        }
        else {
            this.SEARCHRULES.blockHeight(value, this.props.history) && message.error('Wrong Search Input', 6);
        }
    };

    render() {
        const {content} = this.state;
        const suffix = content ? (
                <Icon type="close-circle" onClick={this.emitEmpty} />
            ) : <span />;
        return (
            <div className="search-container">
                <Input
                    className="header-search"
                    placeholder="Address / Tx / Block / Block Height"
                    // prefix={<Icon type="search" className="search-icon" />}
                    suffix={suffix}
                    value={content}
                    onChange={this.onChangeUserName}
                    ref={node => (this.userNameInput = node)}
                    onPressEnter={this.handleSearch}
                />
                <span
                    className="search-icon-container"
                    onClick={() => this.handleSearch({
                        searchValue: this.state.content
                    })}
                >
                    <Icon type="search" className="search-icon" />
                </span>
            </div>
        );
    }
}

export default withRouter(Search);
