import React, {
    Component
} from "react";
import {
    Table
} from "antd";
import {
    get,
    getContractNames
} from "../../utils";
import {
    ALL_TXS_API_URL,
    ALL_UNCONFIRMED_TXS_API_URL,
    TXS_BLOCK_API_URL,
    PAGE_SIZE,
    ALL_TXS_LIST_COLUMNS
} from "../../constants";

import "./txs.styles.less";
import dayjs from "dayjs";
import { withRouter } from "../../routes/utils";

const ALL_TXS_LIST_COLUMNS_WITH_TIME = [
    ...ALL_TXS_LIST_COLUMNS,
    {
        title: 'Time',
        dataIndex: 'time',
        key: 'time',
        width: 120,
        align: 'center',
        render: text => {
            const time = dayjs(text).format('YYYY-MM-DD HH:mm:ss');
            return time.split(' ').map(v => (
                <p>{v}</p>
            ));
        }
    }
]


class TxsPage extends Component {
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

    componentDidMount() {
        const {
            props
        } = this;
        const {
            location
        } = props;
        this.fetch({
            page: 0,
            limit: PAGE_SIZE,
            block_hash: (!!location.search && location.search.slice(1)) || undefined
        });
    }

    merge(data = {}, contractNames) {
        const {
            transactions = []
        } = data;
        return (transactions || []).map(item => ({
            ...item,
            contractName: contractNames[item.address_to]
        }));
    }

    fetch = async (params = {}) => {
        this.setState({
            loading: true
        });

        const {
            location
        } = this.props;
        const {
            pathname = ''
        } = location;

        let url;
        if (!!params.block_hash) {
            url = TXS_BLOCK_API_URL
        } else {
            url = pathname.indexOf && pathname.indexOf('unconfirmed') === -1 ? ALL_TXS_API_URL : ALL_UNCONFIRMED_TXS_API_URL;
        }
        const data = await get(url, {
            order: "desc",
            ...params
        });
        const contractNames = await getContractNames();

        let pagination = { ...this.state.pagination };
        pagination.total = data.total;
        const transactions = this.merge(data, contractNames);
        this.setState({
            loading: false,
            data: transactions,
            pagination
        });
    };

    handleTableChange = pagination => {
        const pager = {
            ...this.state.pagination
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
            <div className="txs-page-container basic-container basic-container-white" key="body">
                <Table
                    columns={ALL_TXS_LIST_COLUMNS_WITH_TIME}
                    dataSource={data}
                    pagination={pagination}
                    rowKey="tx_id"
                    loading={loading}
                    onChange={handleTableChange}
                    scroll={{ x: 1024 }}
                />
                {/*<div className="basic-bottom-blank"></div>*/}
            </div>
        );
    }
}

export default withRouter(TxsPage)