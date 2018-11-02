import React, {
    Component
} from "react";
import {
    Table
} from "antd";

// Show how to use mobx-react
// import {
//     inject,
//     observer
// } from "mobx-react";

import {
    get
} from "../../utils";
import {
    ALL_BLOCKS_API_URL,
    PAGE_SIZE,
    BLOCKS_LIST_COLUMNS
} from "../../constants";

import "./blocks.styles.less";

// const BLOCKS_LIST_COLUMNS = [
//     {
//         title: "高度",
//         dataIndex: "block_height",
//         key: "block_height",
//         render: text => <Link to={`/block/${text}`}> {text} </Link>
//     },
//     {
//         title: "块龄",
//         dataIndex: "time",
//         key: "time",
//         render: time => <span> {dayjs().from(dayjs(time), true)} </span>
//     },
//     {
//         title: "交易",
//         dataIndex: "tx_count",
//         key: "tx_count",
//         render: (text, row) =>
//             !isNaN(+text) && +text !== 0 ? (
//                 <Link to={`/txs/block?${row.block_hash}`}> {text} </Link>
//             ) : (
//                 text
//             )
//     }
// ];

// @inject("appIncrStore")
// @observer
export default class BlocksPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // data: props.appIncrStore.blockList.blocks.toJSON(),
            data: [],
            pagination: {
                showQuickJumper: true,
                pageSize: PAGE_SIZE,
                total: 0,
                showTotal: total => `Total ${total} items`
            },
            loading: false
        };
    }

    async componentDidMount() {
        await this.fetch({
            page: 0,
            limit: PAGE_SIZE
        });
    }

    componentWillUnmount() {
        this.setState = () => {};
    }

    fetch = async (params = {}) => {
        // const storeBlocks = this.props.appIncrStore.blockList;
        this.setState({
            loading: true
        });

        const data = await get(ALL_BLOCKS_API_URL, {
            order: "desc",
            ...params
        });

        let pagination = this.state.pagination;
        pagination.total = data.total;
        
        this.setState({
            loading: false,
            data: data && data.blocks.length ? data.blocks : null,
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
            <div className="blocks-page-container" key="body">
                <Table
                    columns={BLOCKS_LIST_COLUMNS}
                    dataSource={data}
                    pagination={pagination}
                    rowKey="block_hash"
                    loading={loading}
                    onChange={handleTableChange}
                />
            </div>
        );
    }
}
