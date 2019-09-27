/**
 * @file Address.js
 * @author huangzongzhe, longyue
 */
/* eslint-disable fecs-camelcase */
import React from 'react';
import {
    Table
} from 'antd';
import {
    get
} from '../../utils';

import {
    ALL_TXS_LIST_COLUMNS,
    ADDRESS_TXS_API_URL,
    ELF_REALTIME_PRICE_URL,
    ADDRESS_TOKENS_API_URL,
    // ADDRESS_BALANCE_API_URL,
    ADDRESS_INFO_COLUMN,
    PAGE_SIZE
} from '../../constants';

import './address.styles.less';

export default class AddressPage extends React.Component {
    constructor(props) {
        super(props);
        this.getBlanceAndValueLock = false;
        this.state = {
            address: this.props.match.params.id,
            blance: '-',
            value: '-',
            txs: [],
            pagination: {
                pageSize: PAGE_SIZE,
                showQuickJumper: true,
                showTotal: total => `Total ${total} items`,
                onChange: () => {
                    window.scrollTo(0, 0);
                }
            },
            txs_loading: false
        };
    }

    fetch = async (params = {}) => {
        this.setState({
            txs_loading: true
        });

        const data = await get(ADDRESS_TXS_API_URL, {
            order: 'desc',
            ...params
        });

        console.log(data);
        const pagination = {...this.state.pagination};
        if (data && data.transactions.length) {
            pagination.total = data.total;
            this.setState({
                txsNumber: data.total,
                txs_loading: false,
                txs: data.transactions,
                pagination
            });
        }
        else {
            pagination.total = 0;
            this.setState({
                txsNumber: 0,
                txs_loading: false,
                txs: [],
                pagination
            });
        }
    };

    handleTableChange = pagination => {
        const pager = {...this.state.pagination};
        pager.current = pagination.current;
        this.setState({
            pagination: pager
        });

        this.fetch({
            limit: pagination.pageSize,
            page: pagination.current - 1,
            address: this.props.match.params.id
        });
    };

    // static getDerivedStateFromProps(nextProps, prevState) {
    static getDerivedStateFromProps(nextProps) {
        try {
            return {
                newAddress: nextProps.match.params.id
            };
        }
        catch (e) {
            return {
                newAddress: false
            };
        }
    }

    componentDidUpdate() {
        const newAddress = this.state.newAddress;
        const preAddress = this.state.address;
        if (newAddress && newAddress !== preAddress) {
            this.state.address = newAddress;
            this.getBalanceAndValue(newAddress);
        }
    }

    // TODO:把所有的token都转化成elf计算，然后通过elf来计算总现金市值
    // https://etherscan.io/address/0x284cbb123f5c47c864095f3b69875d9d222752ae#tokentxns
    // http://localhost:3000/address/2hxkDg6Pd2d4yU1A16PTZVMMrEDYEPR8oQojMDwWdax5LsBaxX
    async getBalanceAndValue(address) {
        if (!this.getBlanceAndValueLock) {
            this.getBlanceAndValueLock = true;

            await this.fetch({
                page: 0,
                limit: 25,
                address
            });

            // {USD: 0.322, BTC: 0.00004967, CNY: 2.25}
            const {USD = 0} = await get(ELF_REALTIME_PRICE_URL);
            const tokens = await this.getAddressTokens(address);

            const {balance = 0} = tokens && tokens[0] || {};
            this.setState({
                balance: balance.toLocaleString(),
                value: (parseFloat(balance) * parseFloat(USD)).toLocaleString()
            });
            this.getBlanceAndValueLock = false;
        }
    }

    async componentDidMount() {
        this.getBalanceAndValue(this.state.address);
    }

    componentWillUnmount() {
        this.setState = () => {};
    }

    async getAddressTokens(address) {
        const balance = await get(ADDRESS_TOKENS_API_URL, {
            limit: 20,
            page: 0,
            order: 'desc',
            address
        });
        return balance;
    }

    // async getAddressInfo () {
    //     await get(ADDRESS_BALANCE_API_URL, {

    //     });
    //     // Get Balance
    //     // Get Value
    // }

    render() {
        const {
            address,
            txs,
            pagination,
            txs_loading,
            balance
        } = this.state;

        const addressInfo = [{
            address,
            balance,
            value: this.state.value + ' USD'
            // balance: 243.245423465331,
            // value: '$ 23.23532342'
        }];
  

        return (
            <div className='address-container basic-container' key='body'>
                {/* <div className='address-header-container'>
                    <h3>Overview</h3>
                    <Table
                        className='header-list'
                        columns={ADDRESS_INFO_COLUMN}
                        dataSource={addressInfo}
                        rowKey = 'address'
                        pagination={false}
                    />
                </div> */}
                <h3 style={{
                    color: '#93FF26'
                }}> {this.state.txsNumber && this.state.txsNumber.toLocaleString() || '-'} Transactions</h3>
                <Table
                    columns={ALL_TXS_LIST_COLUMNS}
                    dataSource={txs}
                    pagination={pagination}
                    rowKey = 'tx_id'
                    loading={txs_loading}
                    onChange={pagination => this.handleTableChange(pagination)}
                />
                <div className='basic-bottom-blank'></div>
            </div>
        );
    }
}
