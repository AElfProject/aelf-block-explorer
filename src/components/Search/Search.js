import React, {
    PureComponent
} from "react";
import {
    Input,
    Icon,
    message
} from "antd";

import {
    aelf
} from "../../utils";

import "./search.styles.less";

export default class Search extends PureComponent {
    constructor(props) {
        super(props);
    }

    state = {
        content: ""
    };

    emitEmpty = () => {
        this.userNameInput.focus();
        this.setState({
            content: ""
        });
    };

    onChangeUserName = e => {
        this.setState({
            content: e.target.value
        });
    };

    SEARCHRULES = {
        address: function (value) {
            const url = `/address/${value}`;
            window.open(url);
            message.info('open new window: Address Detail');
        },
        transaction: async function (value) {
            // 先请求一下...如果有结果，就跳转到对应的结果页，都没有就提示查不到东西。
            const {
                result
            } = aelf.chain.getTxResult(value);
            // if (result.block_hash) {
            if (typeof result.tx_info === 'object') {
                window.open(`/tx/${value}`);
                message.info('open new window: Transaction Detail');
                return;
            }

            window.open(`/block/${value}`);
            message.info('open new window: Block Detail');
            return;
        },
        blockHeight: function (value) {
            let number = parseInt(value, 10);
            if (number == value) {
                window.open(`/block/${value}`);
                return false;
            }
            return true;
        }
    }

    handleSearch = e => {
        console.log()
        const value = e.target && e.target.value || e.searchValue || '';
        if (!value.trim()) {
            return;
        }
        const length = value.length;
        const isAddress = [53, 54];
        const isTxid = [64];

        // address.length === 38/66 && address.match(/^0x/)
        // search
        // 0. 0x
        // 1. transaction 66
        // 2. block   66
        // 3. address length=38
        if (isAddress.includes(length)) {
            this.SEARCHRULES.address(value);
        } else if (isTxid.includes(length)) {
            this.SEARCHRULES.transaction(value);
        } else {
            this.SEARCHRULES.blockHeight(value) && message.error('Wrong Search Input', 6);
        }
    };

    render() {
        const { content } = this.state;
        const suffix = content ? (
                <Icon type="close-circle" onClick={this.emitEmpty} />
            ) : null;
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
