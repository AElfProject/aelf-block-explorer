import React from "react";
import {
    Table
} from "antd";
import {
    get
} from "../../utils";
import {
    ALL_TXS_LIST_COLUMNS,
    ADDRESS_TXS_API_URL,
    ADDRESS_INFO_COLUMN,
    PAGE_SIZE
} from "../../constants";

import "./address.styles.less";

export default class AddressPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: "",
            //   blance: -1,
            //   value: -1,
            txs: [],
            pagination: {
                pageSize: PAGE_SIZE,
                showTotal: total => `Total ${total} items`
            },
            txs_loading: false
        };
    }

    fetch = async (params = {}) => {
        this.setState({
            txs_loading: true
        });

        const data = await get(ADDRESS_TXS_API_URL, {
            order: "desc",
            ...params
        });

        const pagination = { ...this.state.pagination
        };
        if (data && data.transactions.length) {
            pagination.total = data.total;
            this.setState({
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
        const pager = { ...this.state.pagination
        };
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
        await fetch({
            page: 0,
            limit: 25,
            address: match.params.id
        });
    }

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
            balance: 243.245423465331,
            value: "$ 23.23532342"
        }];

        return (
            <div className="address-container" key="body">
                <div className="address-header-container">
                    <h3>概况</h3>
                    <Table
                        className="header-list"
                        columns={ADDRESS_INFO_COLUMN}
                        dataSource={addressInfo}
                        rowKey = "address"
                        size="small"
                        pagination={false}
                    />
                </div>
                <h3>交易</h3>
                <Table
                    columns={ALL_TXS_LIST_COLUMNS}
                    dataSource={txs}
                    pagination={pagination}
                    rowKey = "tx_id"
                    loading={txs_loading}
                    onChange={handleTableChange}
                />
            </div>
        );
    }
}
