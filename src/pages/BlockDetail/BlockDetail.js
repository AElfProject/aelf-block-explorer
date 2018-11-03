import React from "react";
import {
    Link
} from "react-router-dom";
import {
    Row,
    Col,
    Button,
    Icon,
    Table
} from "antd";
import {
    aelf,
    format,
    get
} from "../../utils";

import {
    ALL_TXS_LIST_COLUMNS,
    PAGE_SIZE
} from "../../constants";

import "./blockdetail.styles.less";

const ButtonGroup = Button.Group;

export default class BlockDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blockHeight: -1,
            txsCount: 0,
            blockHash: "",
            blockTime: 0,

            txs: [],
            pagination: {
                pageSize: PAGE_SIZE,
                showQuickJumper: true,
                showTotal: total => `Total ${total} items`
            },
            txs_loading: true
        };
    }

    async getTxsList(blockhash) {
        let getTxsOption = {
            limit: 5,
            page: 0,
            order: 'asc',
            block_hash: blockhash
        };

        return await get('/block/transactions', getTxsOption);
    }

    // fetchBlockInfo = blockHeight => {
    fetchBlockInfo = async (input) => {
        this.setState({
            txs_loading: true
        });
        // 先判断是高度还是hash，再执行后续的命令。

        let result;
        let blockHeight;
        let txsList;
        // BlockHeight
        if (!/^0x/.test(input)) {
            blockHeight = input;
            result = aelf.chain.getBlockInfo(input, 100).result;
            const blockhash = result && result.Blockhash;
            if (blockhash) {
                console.log('blockhash: ', blockhash, input)
                txsList = await this.getTxsList(blockhash);
            }
        } else {
            txsList = await this.getTxsList(input);
            let {
                transactions
            } = txsList;
            blockHeight = transactions[0] && transactions[0].block_height;
            result = blockHeight ? aelf.chain.getBlockInfo(blockHeight, 100).result : undefined;
        }

        const pagination = { ...this.state.pagination
        };
        pagination.total = txsList.total;

        this.setState({
            txsCount: result && result.Body && result.Body.TransactionsCount || 'Unminned',
            blockHash: result && result.Blockhash,
            blockTime: result && result.Header && result.Header.Time || '1993-08-09 01:30:30',
            blockHeight: +blockHeight,
            // txs
            txs_loading: false,
            txs: txsList.transactions,
            pagination
        });
    };

    componentDidMount() {
        const {
            params
        } = this.props.match;
        this.fetchBlockInfo(params.id);
    }

    componentDidUpdate() {
        const {
            params
        } = this.props.match;
        const {
            blockHeight,
            txs_loading
        } = this.state;
        if (blockHeight != params.id && !/^0x/.test(params.id) && !txs_loading) {
            this.fetchBlockInfo(params.id);
        }
    }

    componentWillUnmount() {
        this.setState = () => {};
    }

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
    }

    renderTxsList() {
        const {
            txs,
            pagination,
            txs_loading
        } = this.state;
        return (
            <div>
                <h3>交易</h3>
                <Table
                    columns={ALL_TXS_LIST_COLUMNS}
                    dataSource={txs}
                    pagination={pagination}
                    rowKey = "tx_id"
                    loading={txs_loading}
                    onChange={this.handleTableChange}
                />
            </div>
        );
    }

    render() {
        const {
            txsCount,
            blockHash,
            blockTime,
            blockHeight
        } = this.state;
        const {
            params
        } = this.props.match;
        const prevLink = `/block/${blockHeight - 1}`;
        const nextLink = `/block/${blockHeight + 1}`;

        const txsListHtml = this.renderTxsList();

        return (
            <div className="block-detail-container">
                <div className="block-detail-panle">区块信息</div>
                <Row gutter={16} className="block-detail-body">
                <Col span={3}>区块高度:</Col>
                <Col span={21}>{blockHeight}</Col>
                <Col span={3}>交易数量:</Col>
                <Col span={21}>{txsCount}</Col>
                <Col span={3}>区块哈希:</Col>
                <Col span={21}>{blockHash}</Col>
                <Col span={3}>时间戳:</Col>
                <Col span={21}>{format(blockTime)}</Col>
                </Row>
                <ButtonGroup className="block-detail-footer">
                <Link className="ant-btn" to={prevLink}>
                    <Icon type="left" />
                    上一个
                </Link>
                <Link className="ant-btn" to={nextLink}>
                    下一个
                    <Icon type="right" />
                </Link>
                </ButtonGroup>

                {txsListHtml}
                
            </div>
        );
    }
}
