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
                showTotal: total => `Total ${total} items`,
                onChange: () => {
                    window.scrollTo(0, 0);
                }
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
        const pager = {...this.state.pagination
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
        console.log(data);
        const {
            handleTableChange
        } = this;

        return (
            <div className="blocks-page-container basic-container" key="body">
                <Table
                    columns={BLOCKS_LIST_COLUMNS}
                    dataSource={data}
                    pagination={pagination}
                    rowKey="block_hash"
                    loading={loading}
                    onChange={handleTableChange}
                />
                <div className="basic-bottom-blank"></div>
            </div>
        );
    }
}
