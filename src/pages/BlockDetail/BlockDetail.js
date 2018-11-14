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
    get,
    formatKey
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
        let error;
        // BlockHeight
        if (parseInt(input) == input) {
            blockHeight = input;
            let output = aelf.chain.getBlockInfo(input, 100);
            result = output.result;
            error = output.error;

            const blockhash = result && result.Blockhash;
            if (blockhash) {
                txsList = await this.getTxsList(blockhash);
            }
        } else {
            txsList = await this.getTxsList(input);

            let {
                transactions
            } = txsList;
            error = transactions.length ? '' : 'Not Found';
            blockHeight = transactions[0] && transactions[0].block_height;
            result = blockHeight ? aelf.chain.getBlockInfo(blockHeight, 100).result : undefined;
        }

        const pagination = {
            ...this.state.pagination
        };
        pagination.total = txsList && txsList.total || 0;

        this.setState({
            blockInfo: {
                blockHeight: +blockHeight || 'Not Found',
                blockHash: result && result.Blockhash,
                txsCount: result && result.Body && result.Body.TransactionsCount || 'Not Found',
                ...(result && result.Header || {})
            },
            error: error,
            blockHeight: +blockHeight,
            // txs
            txs_loading: false,
            txs: txsList && txsList.transactions || [],
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
        if (blockHeight != params.id && parseInt(params.id) == params.id && !txs_loading) {
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
                <h3>Transaction List</h3>
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

    renderCol(key, value) {
        return (
            <div key={key + Math.random()}>
                <Col span={6} style={{height: 34}}>{formatKey(key)}</Col>
                <Col span={18} style={{height: 34}}>{value}</Col>
            </div>
        );
    }

    renderCols() {
        const blockInfo = this.state.blockInfo;
        let html = [];
        let blackList = ['Index'];
        for (const each in blockInfo) {
            if (blackList.indexOf(each) >= 0) {
            } else if (each === 'Time') {
                html.push(this.renderCol(each, format(blockInfo[each])));
            } else {
                html.push(this.renderCol(each, blockInfo[each]));
            }

        }
        return html;
    }

    renderMoreInfo() {
        const txsListHtml = this.renderTxsList();
        const {
            blockHeight
        } = this.state;

        const prevLink = `/block/${blockHeight - 1}`;
        const nextLink = `/block/${blockHeight + 1}`;

        return (
            <div>
                <ButtonGroup className="block-detail-footer">
                    <Link className="ant-btn" to={prevLink}>
                        <Icon type="left" />
                        pre
                    </Link>
                    <Link className="ant-btn" to={nextLink}>
                        next
                        <Icon type="right" />
                    </Link>
                </ButtonGroup>
                {txsListHtml}
            </div>
        );
    }

    render() {
        const error = this.state.error;

        let moreInfoHtml;
        let colsHtml;

        if (error) {
            colsHtml = this.renderCol('error', error);
        } else {
            colsHtml = this.renderCols();
            moreInfoHtml = this.renderMoreInfo();
        }

        return (
            <div className="block-detail-container">
                <div className="block-detail-panle">Overview</div>
                <Row gutter={16} className="block-detail-body">
                    {colsHtml}
                </Row>

                {moreInfoHtml}
            </div>
        );
    }
}
