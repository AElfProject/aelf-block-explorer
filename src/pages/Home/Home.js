/**
 * @file Home.js
 * @author longyue, huangzongzhe
 */
/* eslint-disable fecs-camelcase */
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
// import { observer, inject } from "mobx-react";
import {
    Row,
    Col,
    List,
    message
} from 'antd';

// object, array, string, or  jQuery - like
import isEmpty from 'lodash/isEmpty';
// import InfoList from "../../components/InfoList/InfoList";
// import TradeCards from "../../components/TradeCards/TradeCards";
// import TradeChart from "../../components/TradeChart";

import SearchBanner from '../../components/SearchBanner/SearchBanner';
import ContainerRichard from '../../components/ContainerRichard/ContainerRichard';
import TPSChart from '../../components/TPSChart/TPSChart';

import SmoothScrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';
import Scrollbar from 'react-smooth-scrollbar';

import {get, format, aelf, transactionFormat} from '../../utils';
import {
    PAGE_SIZE,
    ALL_BLOCKS_API_URL,
    ALL_TXS_API_URL
} from '../../constants';

import './home.styles.less';

SmoothScrollbar.use(OverscrollPlugin);

const fetchInfoByChainIntervalTime = 4000;

// @inject("appIncrStore")
// @observer
export default class HomePage extends Component {

    state = {
        blocks: [],
        transactions: []
    };

    blockHeight = 0;

    async fetch(url) {
        const res = await get(url, {
            page: 0,
            limit: PAGE_SIZE,
            order: 'desc'
        });

        return res;
    }

    componentDidCatch(error) {
        // console.error(error);
        // TODO 弹窗提示
        clearInterval(this.interval);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.setState = () => {};
    }

    // it's making two xhr to get realtime block_height and transaction data.
    async componentDidMount() {
        // it's simplest that it do not need block_scan_api to get full chain data.
        // but it need a some sugar.
        const blocksResult = await this.fetch(ALL_BLOCKS_API_URL);

        const blocks = blocksResult.blocks;
        console.log(blocksResult);
        const block_height = blocks[0].block_height;
        this.blockHeightInDataBase = block_height;
        this.blockHeight = block_height;

        // TODO: 链上会提供批量请求的接口，如果一个区块的交易数多于25个，我们只请求其中的25个交易来展示。
        const TXSResult = await this.fetch(ALL_TXS_API_URL);
        const transactions = TXSResult.transactions;
        const totalTransactions = TXSResult.total;

        this.setState({
            blocks,
            transactions,
            totalTransactions
        });

        this.interval = setInterval(() => {
            this.fetchInfoByChain();
        }, fetchInfoByChainIntervalTime);
    }

    getBlockHeightPromise() {
        return new Promise((resolve, reject) => {
            if (this.blockHeight) {
                resolve(+this.blockHeight + 1);
            }
            else {
                aelf.chain.getBlockHeight((err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        const {
                            result: {
                                block_height
                            }
                        } = result;
                        if (parseInt(block_height, 10) <= parseInt(this.blockHeightInDataBase, 10)) {
                            resolve(false);
                            return;
                        }
                        resolve(block_height);
                    }
                });
            }
        });
    }

    // get increament block data
    // 1. Get the lastest 100 Blocks Info from databases at first.
    // 2. Get the new Blocks Info from AElf Chain.
    // 3. If the (block_height in Chain) - (block_height in Databases) > 10,
    //    Notice the users we have problem, and get New Block from AElf Chain.
    // 4. In the page, if block.length > 100, .length =100 ,then, unshift.
    fetchInfoByChain() {
        // const store = this.props.appIncrStore;
        let newBlocksList = [].concat(...this.state.blocks);
        let newTxsList = [].concat(...this.state.transactions);

        this.getBlockHeightPromise().then(blockHeight => {
            if (!blockHeight) {
                return;
            }
            aelf.chain.getBlockByHeight(blockHeight, true, (err, result) => {
                if (err) {
                    console.log('getBlockByHeight: ', err);
                    message.error('Can not get Block Info from AElf Node!!!.', 6);
                    return;
                }
                const {
                    // result: {BlockHash = '', Body = '', Header = ''} = {}
                    BlockHash,
                    Body,
                    Header
                } = result;
                if (isEmpty(BlockHash)) {
                    return;
                }

                const chainBlocks = {
                    block_hash: BlockHash,
                    block_height: +blockHeight,
                    chain_id: Header.ChainId,
                    merkle_root_state: Header.MerkleTreeRootOfWorldState,
                    merkle_root_tx: Header.MerkleTreeRootOfTransactions,
                    pre_block_hash: Header.PreviousBlockHash,
                    time: Header.Time,
                    tx_count: Body.TransactionsCount
                };

                let pre_block_height = newBlocksList[0].block_height;
                if (blockHeight - pre_block_height > 10) {
                    message.warning(
                        'Notice: Blocks in Databases is behind more than 10 blocks in the Chain.',
                        6
                    );
                }

                newBlocksList.unshift(chainBlocks);
                newBlocksList.length = PAGE_SIZE;
                if (!isEmpty(Body.Transactions)) {
                    // console.log('Body', BlockHash, Body.TransactionsCount);
                    aelf.chain.getTxResults(BlockHash, 0, PAGE_SIZE, (error, result) => {
                        if (error || !result) {
                            message.error(error.message, 2);
                            return;
                        }
                        const txsList = result || [];

                        const txsFormatted = txsList.map(tx => {
                            return transactionFormat(tx);
                        });

                        newTxsList.unshift(...txsFormatted);
                        newTxsList.length = PAGE_SIZE;

                        this.blockHeight = blockHeight;
                        this.setState({
                            blocks: newBlocksList,
                            transactions: newTxsList
                        });
                    });
                }
            });
        }).catch(err => {
            message.error(err.message, 2);
        });
    }

    renderBasicInfoBlocks() {
        // TODO:getBasicInfo data
        const basicInfo = [{
            title: 'Block Height',
            info: this.blockHeight
        }, {
            title: 'Unconfirmed Block',
            info: '-'
        }, {
            title: 'Total Transactions',
            info: this.state.totalTransactions
        }, {
            title: 'Total Applications',
            info: '-'
        }, {
            title: 'Total Accounts',
            info: '-'
        }, {
            title: 'Total Side Chains',
            info: '-'
        }];

        const html = basicInfo.map(item => {
            return (
                <Col xs={12} sm={12} md={12} lg={8}
                     className='home-basic-info-con'
                     key={item.title + Math.random()}
                >
                    <ContainerRichard type='small'>
                        <div
                            className='home-basic-info-content-con'
                        >
                            <div className='home-basic-info-title'>{item.title}</div>
                            <div className='home-basic-info-num'>{item.info && item.info.toLocaleString() || '-'}</div>
                        </div>
                    </ContainerRichard>
                </Col>
            );
        });
        return html;
    }

    renderSearcBanner() {
        if (document.body.offsetWidth <= 768) {
            return '';
        }
        return <SearchBanner />;
    }

    renderFirstPage() {
        const screenWidth = document.body.offsetWidth;
        const screenHeight = screenWidth > 992 ? document.body.offsetHeight : 'auto';
        const BasicInfoBlocksHTML = this.renderBasicInfoBlocks();

        // TODO: getTPS data
        return (
            <section
                className='home-bg-earth'
                style={{
                    height: screenHeight
                }}
            >
                <div className='basic-container home-basic-information'>
                    <div className="home-header-blank"></div>
                    {this.renderSearcBanner()}
                    <Row
                        type="flex"
                        justify="space-between"
                        align="middle"
                        key="firstpage"
                        gutter={
                            { xs: 8, sm: 16, md: 24, lg: 32 }
                        }
                    >
                        <Col xs={24} sm={24} md={24} lg={12}>
                            <div className='home-basic-title-con'>
                                {/*<span className='TPSChart-title'>TPS Monitor</span>*/}
                                <span className='TPSChart-title'>Transaction Per Minute</span>
                                {/*<span className='TPSChart-text'>Realtime：233</span>*/}
                                {/*<span>Peak：23333</span>*/}
                            </div>
                            <ContainerRichard>
                                <TPSChart/>
                            </ContainerRichard>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={12}>
                            <div className='home-basic-title-con'>&nbsp;</div>
                            <Row
                                type="flex"
                                justify="space-between"
                                align="middle"
                                key="basicinfo-1"
                                gutter={
                                    {xs: 8, sm: 16, md: 16, lg: 16}
                                }
                            >
                                {BasicInfoBlocksHTML}
                            </Row>
                        </Col>
                    </Row>
                </div>
            </section>
        );
    }

    blockRenderItem = item => {
        const blockHeight = item.block_height;
        const title = (
            <span>
                <Link to={`/block/${blockHeight}`}>{blockHeight}</Link>
            </span>
        );
        const desc = (
            <span className="infoList-desc">
                <Link to={`/txs/block?${item.block_hash}`}>{item.tx_count}</Link>
            </span>
        );

        return (
            <Row
                type="flex"
                align="middle"
                className="blocks-list-container"
                key={item.block_hash}
            >
                <Col span={4}>{title}</Col>
                <Col span={4}>{desc}</Col>
                <Col span={16}>{format(item.time)}</Col>
                {/*<Col span='2'>hzz780</Col>*/}
            </Row>
        );

    };

    txsRenderItem = item => {
        // const blockHeight = item.block_height;

        let tx_id = item.tx_id;
        // let txIDlength = tx_id.length;
        // let txIDShow = tx_id.slice(0, 10) + '...' + tx_id.slice(txIDlength - 10, txIDlength);
        let txIDShow = tx_id.slice(0, 12) + '...';

        const title = (
            <span>
                <Link to={`/tx/${tx_id}`}>
                    {txIDShow}
                </Link>
            </span>
        );

        const from = (
            <span className="infoList-desc">
                <Link to={`/address/${item.address_from}`}>
                    {item.address_from.slice(0, 12)}...
                </Link>
            </span>
        );

        const to = (
            <Link to={`/address/${item.address_to}`}>
                {item.address_to.slice(0, 12)}...
            </Link>
        );

        return (
            <Row
                type="flex"
                align="middle"
                className="blocks-list-container"
                key={tx_id}
            >
                <Col span={8}>{title}</Col>
                <Col span={8}>{from}</Col>
                <Col span={8}>{to}</Col>
            </Row>
        );

        // return (
        //     <List.Item key={blockHeight}>
        //         <List.Item.Meta title={title} description={desc} />
        //         <div>Trading Status: {TXSSTATUS[item.tx_status]}</div>
        //     </List.Item>
        // );
    };

    renderBlocksAndTxsList() {
        const {blocks, transactions} = this.state;

        const blocksHTML = blocks.map(item => {
            return this.blockRenderItem(item);
        });

        const transactionsHTML = transactions.map(item => {
            return this.txsRenderItem(item);
        });

        const screenHeight = document.documentElement.offsetHeight;
        const heightStyle = {
            height: screenHeight - 64 * 3 - 100
        };

        return [
            <Row
                key='basicinfo'
            >
                <Col
                    span={24}
                >
                    <div></div>
                </Col>
            </Row>,
            <Row
                type="flex"
                justify="space-between"
                align="middle"
                className="content-container"
                key="infolist"
                gutter={
                    {xs: 8, sm: 16, md: 24, lg: 32}
                }
            >
                {/*<Col span={12} className="container-list">*/}
                <Col xs={24} sm={24} md={12} className="container-list">
                    <div className="panel-heading">
                        <h2 className="panel-title">
                            {/*<Icon type="gold" className="anticon" />*/}
                            Blocks
                        </h2>
                        <Link to="/blocks" className="pannel-btn">
                            View all
                        </Link>
                    </div>
                    <div>
                        <Row
                            type="flex"
                            // justify="space-between"
                            align="middle"
                            className="home-blocksInfo-title"
                            key='home-blocksInfo'
                        >
                            <Col span={4}>Height</Col>
                            <Col span={4}>TXS</Col>
                            <Col span={16}>Time</Col>
                            {/*<Col span='2'>Miner</Col>*/}
                        </Row>
                    </div>
                    <div
                        className='home-blocksInfo-list-con'
                    >
                        <Scrollbar
                            style={heightStyle}
                        >
                            {blocksHTML}
                        </Scrollbar>
                    </div>
                </Col>
                {/*<Col span={12} className="container-list">*/}
                <Col xs={24} sm={24} md={12} className="container-list">
                    <div className="panel-heading">
                        <h2 className="panel-title">
                            {/*<Icon type="gold" className="anticon" />*/}
                            Transactions
                        </h2>
                        <Link to="/txs" className="pannel-btn">
                            View all
                        </Link>
                    </div>
                    <div>
                        <Row
                            type="flex"
                            // justify="space-between"
                            align="middle"
                            className="home-blocksInfo-title"
                            key='home-blocksInfo'
                        >
                            <Col span={8}>Tx ID</Col>
                            <Col span={8}>From</Col>
                            <Col span={8}>To</Col>
                            {/*<Col span='6'>Time</Col>*/}
                        </Row>
                    </div>
                    <div
                        className='home-blocksInfo-list-con'
                    >
                        <Scrollbar
                            style={heightStyle}
                        >
                            {transactionsHTML}
                        </Scrollbar>
                    </div>
                </Col>
            </Row>
        ];
    }

    render() {
        const blocksAndTxsListHTML = this.renderBlocksAndTxsList();
        const firstPageHTML = this.renderFirstPage();

        return (
            <div className='fullscreen-container'>
                {firstPageHTML}
                <section className='home-bg-blue'>
                    <div className='basic-container'>
                        {blocksAndTxsListHTML}
                    </div>
                </section>
            </div>

        )
    }
}
