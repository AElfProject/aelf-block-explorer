import React, {
    Component
} from "react";
import {
    Table
} from "antd";
import {
    get
} from "../../utils";
import {
    ALL_TXS_API_URL,
    TXS_BLOCK_API_URL,
    PAGE_SIZE,
    ALL_TXS_LIST_COLUMNS
} from "../../constants";

import "./txs.styles.less";

export default class TxsPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            pagination: {
                pageSize: PAGE_SIZE,
                showQuickJumper: true,
                total: 0,
                showTotal: total => `Total ${total} items`,
                onChange: () => {
                    window.scrollTo(0, 0);
                }
            },
            loading: false
        };
    }

    async componentDidMount() {
        const {
            fetch,
            props
        } = this;
        const {
            location
        } = props;
        await fetch({
            page: 0,
            limit: PAGE_SIZE,
            block_hash: (!!location.search && location.search.slice(1)) || undefined
        });
    }

    componentWillUnmount() {
        this.setState = () => {};
    }

    fetch = async (params = {}) => {
        this.setState({
            loading: true
        });

        const url = !!params.block_hash ? TXS_BLOCK_API_URL : ALL_TXS_API_URL;
        const data = await get(url, {
            order: "desc",
            ...params
        });

        let pagination = { ...this.state.pagination
        };
        pagination.total = data.total;

        this.setState({
            loading: false,
            data: data && data.transactions.length ? data.transactions : null,
            pagination
        });
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
            page: pagination.current - 1
        });
    };

    render() {
        const {
            data,
            pagination,
            loading
        } = this.state;
        const {
            handleTableChange
        } = this;

        return (
            <div className="txs-page-container basic-container" key="body">
                <Table
                    columns={ALL_TXS_LIST_COLUMNS}
                    dataSource={data}
                    pagination={pagination}
                    rowKey="tx_id"
                    loading={loading}
                    onChange={handleTableChange}
                />
                <div className="basic-bottom-blank"></div>
            </div>
        );
    }
}
