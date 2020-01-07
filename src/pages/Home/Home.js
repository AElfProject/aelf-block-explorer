/**
 * @file Home.js
 * @author longyue, huangzongzhe
 */
/* eslint-disable fecs-camelcase */
import React, {Component} from 'react';
import io from 'socket.io-client';
import {Link} from 'react-router-dom';
import {
    Row,
    Col
} from 'antd';

import SearchBanner from '../../components/SearchBanner/SearchBanner';
import ContainerRichard from '../../components/ContainerRichard/ContainerRichard';
import TPSChart from '../../components/TPSChart/TPSChart';

import SmoothScrollbar from 'smooth-scrollbar';
import OverscrollPlugin from 'smooth-scrollbar/plugins/overscroll';
import Scrollbar from 'react-smooth-scrollbar';

import {get, format, transactionFormat} from '../../utils';
import {
    PAGE_SIZE,
    ALL_BLOCKS_API_URL,
    ALL_TXS_API_URL,
    SOCKET_URL
} from '../../constants';
import {ADDRESS_INFO} from '../../../config/config';

import './home.styles.less';

SmoothScrollbar.use(OverscrollPlugin);

const fetchInfoByChainIntervalTime = 500;

// @inject("appIncrStore")
// @observer
export default class HomePage extends Component {
    state = {
        blocks: [],
        transactions: [],
        totalTransactions: 0,
        totalAccounts: '-',
    };

    blockHeight = 0;
    unconfirmedBlockHeight = 0;

    async fetch(url) {
        const res = await get(url, {
            page: 0,
            limit: PAGE_SIZE,
            order: 'desc'
        });

        return res;
    }

    componentDidCatch(error) {
        console.error(error);
    }

    componentWillUnmount() {
        this.socket.close();
    }

    // it's making two xhr to get realtime block_height and transaction data.
    async componentDidMount() {
        // it's simplest that it do not need block_scan_api to get full chain data.
        // but it need a some sugar.
        const blocksResult = await this.fetch(ALL_BLOCKS_API_URL);

        const blocks = blocksResult.blocks;

        const TXSResult = await this.fetch(ALL_TXS_API_URL);
        const transactions = TXSResult.transactions;
        const totalTransactions = TXSResult.total;

        this.setState({
            blocks,
            transactions,
            totalTransactions
        });

        this.initSocket();
    }

    initSocket() {
        this.socket = io(location.origin, {
            path: SOCKET_URL,
            transports: ['websocket', 'polling']
        });

        this.socket.on('reconnect_attempt', () => {
            this.socket.io.opts.transports = ['polling', 'websocket'];
        });
        this.socket.on('connection', function (data) {
            if (data !== 'success') {
                throw new Error('can\'t connect to socket');
            }
        });

        this.socket.on('getOnFirst', data => {
            this.handleSocketData(data, true);
            this.socket.on('getBlocksList', data => {
                this.handleSocketData(data);
            });
        });
        this.socket.emit('getBlocksList');
    }

    handleSocketData({
        list = [],
        height = 0,
        totalTxs,
        unconfirmedBlockHeight = 0,
        accountNumber = 0
    }, isFirst) {
        let arr = list;
        if (!isFirst) {
            arr = list.filter(item => {
                return item.block.Header.Height > this.blockHeight;
            });
        }
        arr.sort((pre, next) => next.block.Header.Height - pre.block.Header.Height);
        const transactions = arr.reduce((acc, i) => acc.concat(i.txs), []).map(transactionFormat);
        const blocks = arr.map(item => this.formatBlock(item.block));
        this.blockHeight = height;
        this.unconfirmedBlockHeight = unconfirmedBlockHeight;
        this.setState({
            blocks: ([...blocks, ...this.state.blocks]).slice(0, 25),
            transactions: ([...transactions, ...this.state.transactions]).slice(0, 25),
            totalTransactions: totalTxs,
            totalAccounts: accountNumber
        });
    }

    formatBlock(block) {
        const {BlockHash, Header, Body} = block;
        return {
            block_hash: BlockHash,
            block_height: +Header.Height,
            chain_id: Header.ChainId,
            merkle_root_state: Header.MerkleTreeRootOfWorldState,
            merkle_root_tx: Header.MerkleTreeRootOfTransactions,
            pre_block_hash: Header.PreviousBlockHash,
            time: Header.Time,
            tx_count: Body.TransactionsCount
        };
    }

    renderBasicInfoBlocks() {
        // TODO:getBasicInfo data
        // TODO: ensure the data to be type of number at the time getting the data
        const basicInfo = [{
            title: 'Block Height',
            info: +this.blockHeight
        }, {
            title: 'Unconfirmed Block',
            info: +this.unconfirmedBlockHeight
        }, {
            title: 'Total Transactions',
            info: +this.state.totalTransactions
        }, {
            title: 'Total Accounts',
            info: +this.state.totalAccounts || '-'
        }, {
            title: 'Total Side Chains',
            info: 5
        }];

        const html = basicInfo.map(item => {
            return (
                <Col xs={12} sm={8} md={6}
                     className='home-basic-info-con'
                     key={item.title}
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

    renderSearchBanner() {
        if (document.body.offsetWidth <= 768) {
            return '';
        }
        return <SearchBanner />;
    }

    renderFirstPage() {
        const screenWidth = document.body.offsetWidth;
        // const screenHeight = screenWidth > 992 ? document.body.offsetHeight : 'auto';
        // const screenHeight = screenWidth < 992 ? 'auto' : document.body.offsetHeight;
        const height = document.body.offsetHeight >= 915 ? 915 : 'auto';
        const screenHeight = screenWidth < 992 ? 'auto' : height;
        // const screenHeight = screenWidth > 992 ? 'auto' : '100%';
        // const screenHeight = 'auto';
        const BasicInfoBlocksHTML = this.renderBasicInfoBlocks();

        // TODO: getTPS data
        return (
            <section
                // className='home-bg-earth'
                className='home-bg-grey'
                style={{
                    height: screenHeight
                }}
            >
                <div className='basic-container home-basic-information'>
                    <div className="home-header-blank"></div>
                    {this.renderSearchBanner()}
                    <Row
                        className='flex-column flex-column-reverse-mobile'
                        type="flex"
                        justify="space-between"
                        align="middle"
                        key="firstpage"
                        gutter={
                            { xs: 8, sm: 16, md: 24, lg: 32 }
                        }
                    >
                        <Col xs={24} sm={24} md={24} lg={24} className="first-page-sub-container">
                            <div className='home-basic-title-con'>
                                <span className='TPSChart-title'>Transaction Per Minute</span>
                            </div>
                            <ContainerRichard>
                                <TPSChart/>
                            </ContainerRichard>
                        </Col>
                        <Col xs={24} sm={24} md={24} lg={24} className="first-page-sub-container">
                            <Row
                                type="flex"
                                align="middle"
                                key="basicinfo-1"
                                gutter={
                                    {xs: 4, sm: 8, md: 8, lg: 8}
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
            <Link to={`/block/${blockHeight}`}>{blockHeight}</Link>
        );
        const desc = (
            <Link to={`/txs/block?${item.block_hash}`}>{item.tx_count}</Link>
        );

        return (
            <Row
                type="flex"
                align="middle"
                className="blocks-list-container"
                key={item.block_hash}
            >
                <Col className="text-ellipse" span={4}>{title}</Col>
                <Col className="text-ellipse" span={4}>{desc}</Col>
                <Col className="text-ellipse" span={16}>{format(item.time)}</Col>
            </Row>
        );

    };

    txsRenderItem = item => {

        let cutNum = 12;
        if (document.body.offsetWidth <= 414) {
          cutNum = 11;
        }

        let tx_id = item.tx_id;
        let txIDShow = tx_id.slice(0, cutNum) + '...';

        const title = (
            <Link to={`/tx/${tx_id}`}>
                {txIDShow}
            </Link>
        );

        const from = (
            <Link to={`/address/${item.address_from}`}>
                {ADDRESS_INFO.PREFIX + '_' + item.address_from.slice(0, cutNum)}...
            </Link>
        );

        const to = (
            <Link to={`/address/${item.address_to}`}>
                {ADDRESS_INFO.PREFIX + '_' + item.address_to.slice(0, cutNum)}...
            </Link>
        );

        return (
            <Row
                type="flex"
                align="middle"
                className="blocks-list-container"
                key={tx_id}
            >
                <Col className="text-ellipse" span={6}>{title}</Col>
                <Col className="text-ellipse" span={9}>{from}</Col>
                <Col className="text-ellipse" span={9}>{to}</Col>
            </Row>
        );
    };

    renderBlocksAndTxsList() {
        const {blocks, transactions} = this.state;

        // const blocksReversed = blocks.reverse();
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
                <Col xs={24} sm={24} md={12} className="container-list">
                    <div className="panel-heading">
                        <h2 className="panel-title">
                            Latest Blocks
                        </h2>
                        <Link to="/blocks" className="pannel-btn">
                            View all
                        </Link>
                    </div>
                    <div>
                        <Row
                            type="flex"
                            align="middle"
                            className="home-blocksInfo-title"
                            key='home-blocksInfo'
                        >
                            <Col span={4}>Height</Col>
                            <Col span={4}>TXS</Col>
                            <Col span={16}>Time</Col>
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
                <Col xs={24} sm={24} md={12} className="container-list">
                    <div className="panel-heading">
                        <h2 className="panel-title">
                            Latest Transactions
                        </h2>
                        <Link to="/txs" className="pannel-btn">
                            View all
                        </Link>
                    </div>
                    <div>
                        <Row
                            type="flex"
                            align="middle"
                            className="home-blocksInfo-title"
                            key='home-blocksInfo'
                        >
                            <Col span={6}>Tx ID</Col>
                            <Col span={9}>From</Col>
                            <Col span={9}>To</Col>
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
                <section className='home-bg-white'>
                    <div className='basic-container'>
                        {blocksAndTxsListHTML}
                    </div>
                </section>
            </div>
        )
    }
}
