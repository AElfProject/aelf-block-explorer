import React from 'react';
import {
    Link
} from 'react-router-dom';
import {
    Row,
    Col,
    Icon,
    Table,
    message, Tag
} from 'antd';
import {
    aelf,
    format,
    get,
    formatKey,
} from '../../utils';

import {isPhoneCheck} from '../../utils/deviceCheck'

import {
    ALL_TXS_LIST_COLUMNS
} from '../../constants';

import './blockdetail.styles.less';

export default class BlockDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blockHeight: -1,
            txsCount: 0,
            blockHash: '',
            blockTime: 0,
            chainStatus: {},
            txs: [],
            pagination: {
                pageSize: isPhoneCheck() ? 8 : 20,
                showQuickJumper: true,
                showTotal: total => `Total ${total} items`
            },
            txs_loading: true
        };
    }

    async getTxsList(blockhash, page) {
        let getTxsOption = {
            limit: isPhoneCheck() ? 8 : 20,
            page: page || 0,
            order: 'asc',
            block_hash: blockhash
        };

        return await get('/block/transactions', getTxsOption);
    }

    getChainStatus() {
        aelf.chain.getChainStatus().then(result => {
            this.setState({
                chainStatus: result
            });
        });
    }

    // fetchBlockInfo = blockHeight => {
    fetchBlockInfo = async (input) => {
        this.getChainStatus();
        this.setState({
            txs_loading: true
        });

        const messageHide = message.loading('Loading...', 0);

        // 先判断是高度还是hash，再执行后续的命令。
        let result;
        let blockHeight;
        let txsList;
        let error;
        // BlockHeight
        console.log('input', input, parseInt(input, 10));

        if (parseInt(input, 10) == input) {
            blockHeight = input;
            try {
                result = await aelf.chain.getBlockByHeight(input, true);
                const blockhash = result && result.BlockHash;
                if (blockhash) {
                    txsList = await this.getTxsList(blockhash);
                }
            } catch (err) {
                console.error('err', err);
            }
        }
        else {
            txsList = await this.getTxsList(input);
            let {
                transactions
            } = txsList;
            error = transactions.length ? '' : 'Not Found';
            blockHeight = transactions[0] && transactions[0].block_height;
            result = blockHeight ? await aelf.chain.getBlockByHeight(blockHeight, true) : undefined;
        }

        const pagination = {
            ...this.state.pagination,
            total: result && result.Body && result.Body.TransactionsCount || 0
        };

        // Dismiss manually and asynchronously
        setTimeout(messageHide, 0);

        this.setState({
            blockInfo: {
                // blockHeight: +blockHeight || 'Not Found',
                blockHash: result && result.BlockHash,
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
        const pager = {
            ...this.state.pagination,
            current: pagination.current
        };

        this.setState({
            pagination: pager
        });
        const {blockInfo} = this.state;
        this.getTxsList(blockInfo.blockHash, pagination.current - 1).then(result => {
            this.setState({
                txs: result.transactions
            });
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
                <h3 className='block-detail-txs-title'>Transaction List</h3>
                <Table
                    columns={ALL_TXS_LIST_COLUMNS}
                    dataSource={txs}
                    pagination={pagination}
                    rowKey = 'tx_id'
                    loading={txs_loading}
                    onChange={this.handleTableChange}
                    scroll={{x: 1024}}
                />
            </div>
        );
    }

    renderCodeLikeParams(value, rows = 8) {
        let jsonFormatted = value;
        try {
            jsonFormatted = JSON.stringify(JSON.parse(value), null, 4);
        } catch(e) {
            // do nothing
        }

        return <textarea
          rows={rows}
          value={jsonFormatted}
          className='tx-block-code-like-content'
          disabled>
        </textarea>
    }

    renderCol(key, value) {
        // If you want double click & select, you need the extra <div>.
        // Because of the 'float'? I do not clear it.

        let valueHTML = value;
        const {LastIrreversibleBlockHeight} = this.state.chainStatus;

        switch (key) {
            case 'Extra':
                valueHTML = this.renderCodeLikeParams(value, 4);
                break;
            case 'Bloom':
                valueHTML = this.renderCodeLikeParams(value, 1);
                break;
            case 'Height':
                const confirmedBlocks = LastIrreversibleBlockHeight - value;
                const isIB = confirmedBlocks >= 0;

                valueHTML = (<>
                    {value} {isIB
                  ? <Tag>{confirmedBlocks} Block Confirmations </Tag>
                  : (<Tag color='red'>Unconfirmed</Tag>)}
                </>);
                break;
        }

        return (
            <Row key={key + Math.random()}>
                <Col xs={24} sm={24} md={6} lg={6} xl={6} className='title'>{formatKey(key)}</Col>
                <Col xs={24} sm={24} md={18} lg={18} xl={18}><div>{valueHTML}</div></Col>
              {/*<Col span={6}>{formatKey(key)}</Col>*/}
              {/*<Col span={18}><div>{value}</div></Col>*/}
            </Row>
        );
    }

    renderCols() {
        const blockInfo = this.state.blockInfo;
        let html = [];
        let blackList = ['Index'];
        for (const each in blockInfo) {
            if (blackList.indexOf(each) >= 0) {
            }
            else if (each === 'Time') {
                html.push(this.renderCol(each, format(blockInfo[each])));
            }
            else {
                html.push(this.renderCol(each, blockInfo[each]));
            }

        }
        return html;
    }

    renderMoreInfo() {
        const txsListHtml = this.renderTxsList();

        return (
            <div>
                {txsListHtml}
            </div>
        );
    }

    renderBlockPagination() {
        const {
            blockHeight
        } = this.state;

        const prevLink = `/block/${blockHeight - 1}`;
        const nextLink = `/block/${blockHeight + 1}`;

        return (
            <div>
                <Link to={prevLink}>
                    <Icon type='left' />
                    {/*pre*/}
                </Link>
                <span>&nbsp;&nbsp;&nbsp;</span>
                <Link to={nextLink}>
                    {/*next*/}
                    <Icon type='right' />
                </Link>
            </div>
        );
    }

    render() {
        const error = this.state.error;

        let moreInfoHtml;
        let colsHtml;
        if (error) {
            colsHtml = this.renderCol('error', error);
        }
        else {
            colsHtml = this.renderCols();
            moreInfoHtml = this.renderMoreInfo();
        }

        const blockPagination = this.renderBlockPagination();

        return (
            <div className='tx-block-detail-container basic-container basic-container-white'>
                <div className='tx-block-detail-panel tx-block-detail-panel-simple'>
                    <div className='title'>Overview</div>
                    <div>{blockPagination}</div>
                </div>
                <Row className='tx-block-detail-body'>
                    {colsHtml}
                </Row>
                <div>&nbsp;</div>
                {moreInfoHtml}
                {/*<div className='basic-bottom-blank'></div>*/}
            </div>
        );
    }
}
