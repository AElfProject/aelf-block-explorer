/**
 * @file
 * @author huangzongzhe
*/

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
        this.state = {
            address: '',
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

        const pagination = {...this.state.pagination};
        if (data && data.transactions.length) {
            pagination.total = data.total;
            this.setState({
                txsNumber: data.total,
                txs_loading: false,
                txs: data.transactions,
                pagination
            });
        } else {
            this.setState({
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

    async componentDidMount() {
        const {
            fetch,
            props
        } = this;
        const {
            match
        } = props;
        const address = match.params.id;
        await fetch({
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
        // console.log(price, tokens, balance);
        // const balance = await get(ADDRESS_TOKENS_API_URL);
        // this.setState({
        //     price,
        // });
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
            match
        } = this.props;
        const {
            txs,
            pagination,
            txs_loading
        } = this.state;
        const {
            handleTableChange
        } = this;
        const address = match.params.id;
        const addressInfo = [{
            address,
            balance: this.state.balance,
            value: this.state.value + ' USD'
            // balance: 243.245423465331,
            // value: '$ 23.23532342'
        }];

        return (
            <div className='address-container basic-container' key='body'>
                <div className='address-header-container'>
                    <h3>Overview</h3>
                    <Table
                        className='header-list'
                        columns={ADDRESS_INFO_COLUMN}
                        dataSource={addressInfo}
                        rowKey = 'address'
                        pagination={false}
                    />
                </div>
                <h3 style={{
                    color: '#93FF26'
                }}> {this.state.txsNumber && this.state.txsNumber.toLocaleString() || '-'} Transactions</h3>
                <Table
                    columns={ALL_TXS_LIST_COLUMNS}
                    dataSource={txs}
                    pagination={pagination}
                    rowKey = 'tx_id'
                    loading={txs_loading}
                    onChange={handleTableChange}
                />
                <div className='basic-bottom-blank'></div>
            </div>
        );
    }
}
