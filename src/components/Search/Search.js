/**
 * @file Search.js
 * @author huangzongzhe
 */
import React, {
    PureComponent
} from 'react';
import {
    Input,
    Icon,
    message
} from 'antd';

import {
    get
} from '../../utils';

import './search.styles.less';

export default class Search extends PureComponent {

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
        address(value) {
            const url = `/address/${value}`;
            window.open(url);
            message.info('open new window: Address Detail');
        },
        async transaction(value) {
            let getTxsOption = {
                limit: 1,
                page: 0,
                block_hash: value
            };

            const blockInfo = await get('/block/transactions', getTxsOption);
            const isBlock = blockInfo.transactions && blockInfo.transactions.length;
            if (isBlock) {
                window.open(`/block/${value}`);
                message.info('open new window: Block Detail');
            }
            else {
                window.open(`/tx/${value}`);
                message.info('open new window: Transaction Detail');
            }
        },
        blockHeight(value) {
            let number = parseInt(value, 10);
            if (number == value) {
                window.open(`/block/${value}`);
                return false;
            }
            return true;
        }
    }

    handleSearch = e => {
        const value = e.target && e.target.value || e.searchValue || '';
        if (!value.trim()) {
            return;
        }
        const length = value.length;
        const isAddress = [49, 50, 51, 52, 53, 47];
        const isTxid = [64];

        // address.length === 38/66 && address.match(/^0x/)
        // search
        // 0. 0x
        // 1. transaction 66
        // 2. block   66
        // 3. address length=38
        if (isAddress.includes(length)) {
            this.SEARCHRULES.address(value);
        }
        else if (isTxid.includes(length)) {
            this.SEARCHRULES.transaction(value);
        }
        else {
            this.SEARCHRULES.blockHeight(value) && message.error('Wrong Search Input', 6);
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
