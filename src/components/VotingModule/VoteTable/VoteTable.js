/**
 * @file
 * @author zhouminghui
 * Forms need to be split up
*/

import React, {PureComponent} from 'react';
import Button from '../../Button/Button';
import {Table, message} from 'antd';
import getPublicKey from '../../../utils/getPublicKey';
import getHexNumber from '../../../utils/getHexNumber';
import {commonPrivateKey, resourceAddress} from '../../../../config/config';
import hexCharCodeToStr from '../../../utils/hexCharCodeToStr';
import testingContract from '../../../utils/testingContract';
import * as Aelf from 'aelf-sdk';
import './VoteTable.less';

let pageSize = 20;
let page = 0;
export default class VoteTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            nodeName: null,
            currentWallet: this.props.currentWallet,
            refresh: 0,
            loading: false,
            pagination: {
                showQuickJumper: true,
                total: 0,
                showTotal: total => `Total ${total} items`
            },
            consensus: null,
            allVotes: 0,
            showVote: this.props.showVote
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (props.currentWallet !== state.currentWallet) {
            
            return {
                currentWallet: props.currentWallet
            };
        }

        if (props.refresh !== state.refresh) {
            return {
                refresh: props.refresh
            };
        }

        if (props.consensus !== state.consensus) {
            return {
                consensus: props.consensus
            };
        }

        if (props.contracts !== state.contracts) {
            return {
                contracts: props.contracts
            };
        }

        if (props.showVote !== state.showVote) {
            return {
                showVote: props.showVote
            };
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.currentWallet !== this.props.currentWallet) {
            const {showVote, consensus} = this.state;
            if (showVote && consensus) {
                page = 0;
                pageSize = 10;
                let pagination = this.state.pagination;
                pagination.current = 1;
                this.nodeListInformation(
                    {
                        page,
                        pageSize,
                        pagination
                    }
                ).then(() => {
                    this.props.endRefresh();
                });
            }
        }

        if (prevProps.refresh !== this.props.refresh) {
            const {showVote, consensus} = this.state;
            if (showVote && consensus) {
                page = 0;
                pageSize = 10;
                let pagination = this.state.pagination;
                pagination.current = 1;
                this.nodeListInformation(
                    {
                        page,
                        pageSize,
                        pagination
                    }
                ).then(() => {
                    this.props.endRefresh();
                });
            }
        }

        if (prevProps.consensus !== this.props.consensus) {
            const {showVote, pagination} = this.state;
            if (showVote) {
                this.nodeListInformation(
                    {
                        page,
                        pageSize,
                        pagination
                    }
                ).then(() => {
                    this.props.endRefresh();
                });
            }
        }

        if (prevProps.showVote !== this.props.showVote) {
            const {showVote, pagination} = this.state;
            if (showVote) {
                this.nodeListInformation(
                    {
                        page,
                        pageSize,
                        pagination
                    }
                ).then(() => {
                    this.props.endRefresh();
                });
            }
        }
    }

    nodeListInformation = async (params = {}) => {
        const {consensus, currentWallet} = this.state;
        this.setState({
            loading: true
        });
        let {pagination, page, pageSize} = params;
        consensus.GetTicketsCount((error, result) => {
            this.setState({
                allVotes: getHexNumber(result.return)
            });
        });
        consensus.GetPageableCandidatesHistoryInfoToFriendlyString(page, pageSize, (error, result) => {
            let isVote = true;
            let isRedee = true;
            if (currentWallet) {
                if (currentWallet.publicKey === '') {
                    isVote = false;
                    isRedee = false;
                }
            }
            else {
                isVote = false;
                isRedee = false;
            };
            pagination.total = result.CandidatesNumber;
            let nodeList = JSON.parse(hexCharCodeToStr(result.return)).Maps || [];
            if (nodeList.length === 0) {
                this.setState({
                    data: [],
                    loading: false
                });
                return;
            }

            let serial = 0;
            let dataList = [];
            for (let i in nodeList) {
                let nodeInformation = nodeList[i];
                let data = {
                    key: page + serial + 1,
                    serialNumber: page + serial + 1,
                    nodeName: nodeInformation.CurrentAlias,
                    term: nodeInformation.ReappointmentCount || '-',
                    block: nodeInformation.ProducedBlocks || '-',
                    vote: nodeInformation.CurrentVotesNumber || '-',
                    myVote: 0 || '-',
                    operation: {
                        publicKey: i || '',
                        vote: isVote,
                        redeem: isRedee
                    }
                };
                serial++;
                dataList.push(data);
            }
            this.getCurrentWalletVote(dataList);
        });
    }


    getCurrentWalletVote = async dataList => {
        const {currentWallet, consensus} = this.state;
        let key = null;
        if (currentWallet) {
            if (currentWallet.address === '') {
                key = Aelf.wallet.getWalletByPrivateKey(commonPrivateKey).keyPair.getPublic().encode('hex');
            }
            else {
                key = getPublicKey(currentWallet.publicKey);
            }
        }
        else {
            key = Aelf.wallet.getWalletByPrivateKey(commonPrivateKey).keyPair.getPublic().encode('hex');
        }

        consensus.GetTicketsInfoToFriendlyString(key, (error, result) => {
            let votingRecords = JSON.parse(hexCharCodeToStr(result.return)).VotingRecords || [];
            dataList.map((item, index) => {
                let myVote = 0;
                for (let j = 0, len = votingRecords.length; j < len; j++) {
                    if (votingRecords[j].To === item.operation.publicKey) {
                        let IsWithdrawn = votingRecords[j].IsWithdrawn || false;
                        IsWithdrawn ? myVote : myVote += parseInt(votingRecords[j].Count, 10);
                    }
                }
                item.myVote = myVote === 0 ? '-' : myVote.toLocaleString();
                item.operation.redeem = item.myVote === '-' ? false : true;
            });
            const temp = Array.from(dataList);
            this.setState({
                data: temp || null,
                loading: false
            });
        });
    }

    handleTableChange = pagination => {
        let pageOption = this.state.pagination;
        pageOption.current = pagination.current;
        page = 10 * (pagination.current - 1);
        pageSize = page + 10;
        this.nodeListInformation(
            {
                page,
                pageSize,
                pagination: pageOption
            }
        ).then(() => {
            this.props.endRefresh();
        });

    };

    componentWillUnmount() {
        this.setState = function () {};
    }


    // 定义表格的字段与数据
    // 拆出去没办法获取state的状态
    getVoteInfoColumn() {
        const voteInfoColumn = [
            {
                title: 'Serial number',
                dataIndex: 'serialNumber',
                key: 'serialNumber',
                align: 'center'
            },
            {
                title: 'Node name',
                dataIndex: 'nodeName',
                key: 'nodeName',
                align: 'center'
            },
            {
                title: 'Term of office',
                dataIndex: 'term',
                key: 'term',
                align: 'center'
            },
            {
                title: 'Current block',
                dataIndex: 'block',
                key: 'block',
                align: 'center'
            },
            {
                title: 'Number of votes obtained',
                dataIndex: 'vote',
                key: 'vote',
                align: 'center',
                render: vote => {
                    let barVote = vote === '-' ? 0 : vote;
                    let barWidth = (parseInt(barVote, 10) / this.state.allVotes) * 100;
                    return (
                        <div className='vote-progress'>
                            <div className='progress-out'>
                                <div className='progress-in' style={{width: barWidth + '%'}}></div>
                            </div>
                            {vote}
                        </div>
                    );
                }
            },
            {
                title: 'My vote',
                dataIndex: 'myVote',
                key: 'myVote',
                align: 'center'
            },
            {
                title: 'Operation',
                dataIndex: 'operation',
                key: 'operation',
                align: 'center',
                render: text => {
                    let isRedeem = text.vote
                    ? {background: '#097d25', margin: '5px'} : {background: '#aaa', margin: '5px'};
                    let isVote = text.redeem
                    ? {background: '#feb000', margin: '5px'} : {background: '#aaa', margin: '5px'};
                    return (
                        <div style={{textAlign: 'center'}}>
                            <Button title='Vote' style={isRedeem} click={() => {
                                    if (text.vote) {
                                        this.getVoting(text.publicKey);
                                    }
                                }
                            }
                            />
                            <Button title='Redeem' style={isVote} click={() => {
                                    if (text.redeem) {
                                        this.props.showMyVote();
                                    }
                                }
                            }
                            />
                        </div>
                    );
                }
            }
        ];
        return voteInfoColumn;
    }

    getVoting(publicKey) {
        const {data, currentWallet, contracts} = this.state;
        const len = data.length;
        for (let i = 0; i < len; i++) {
            if (data[i].operation.publicKey === publicKey) {
                this.props.obtainInfo(data[i].nodeName, data[i].operation.publicKey);
            }
        }
        window.NightElf.api({
            appName: 'hzzTest',
            method: 'CHECK_PERMISSION',
            type: 'address', // if you did not set type, it aways get by domain.
            address: currentWallet.address
        }).then(result => {
            if (result.error === 200005) {
                message.warning(result.errorMessage.message, 3);
                return;
            }
            if (result.permissions.length === 0) {
                window.NightElf.api({
                    appName: 'hzzTest',
                    method: 'OPEN_PROMPT',
                    chainId: 'AELF',
                    hostname: 'aelf.io',
                    payload: {
                        method: 'SET_PERMISSION',
                        payload: {
                            address: currentWallet.address,
                            contracts: [{
                                chainId: 'AELF',
                                contractAddress: contracts.TOKENADDRESS,
                                contractName: 'token',
                                description: 'token contract'
                            }, {
                                chainId: 'AELF',
                                contractAddress: contracts.DIVIDENDSADDRESS,
                                contractName: 'dividends',
                                description: 'contract dividends'
                            }, {
                                chainId: 'AELF',
                                contractAddress: contracts.CONSENSUSADDRESS,
                                contractName: 'consensus',
                                description: 'contract consensus'
                            }, {
                                chainId: 'AELF',
                                contractAddress: resourceAddress,
                                contractName: 'resource',
                                description: 'contract resource'
                            }]
                        }
                    }
                }).then(result => {
                    if (result.error === 0) {
                        window.NightElf.api({
                            appName: 'hzzTest',
                            method: 'INIT_AELF_CONTRACT',
                            // hostname: 'aelf.io',
                            chainId: 'AELF',
                            payload: {
                                address: currentWallet.address,
                                contractName: 'token',
                                contractAddress: contracts.TOKENADDRESS
                            }
                        }).then(
                            window.NightElf.api({
                                appName: 'hzzTest',
                                method: 'INIT_AELF_CONTRACT',
                                // hostname: 'aelf.io',
                                chainId: 'AELF',
                                payload: {
                                    address: currentWallet.address,
                                    contractName: 'consensus',
                                    contractAddress: contracts.CONSENSUSADDRESS
                                }
                            })
                        ).then(result => {
                            if (result.error === 0) {
                                this.props.showVoteFn();
                            }
                        });
                    }
                    else if (result.error === 200005) {
                        message.warning(result.errorMessage.message, 3);
                    }
                    else {
                        message.error(result.errorMessage.message, 3);
                    }
                });
            }
            else {
                console.log('3>>>>>>>>>>>>>>>>>>>>', result);
                result.permissions.map((item, index) => {
                    if (item.address === currentWallet.address) {
                        testingContract(result, contracts, currentWallet).then(result => {
                            if (result) {
                                window.NightElf.api({
                                    appName: 'hzzTest',
                                    method: 'INIT_AELF_CONTRACT',
                                    // hostname: 'aelf.io',
                                    chainId: 'AELF',
                                    payload: {
                                        address: currentWallet.address,
                                        contractName: 'token',
                                        contractAddress: contracts.TOKENADDRESS
                                    }
                                }).then(
                                    window.NightElf.api({
                                        appName: 'hzzTest',
                                        method: 'INIT_AELF_CONTRACT',
                                        // hostname: 'aelf.io',
                                        chainId: 'AELF',
                                        payload: {
                                            address: currentWallet.address,
                                            contractName: 'consensus',
                                            contractAddress: contracts.CONSENSUSADDRESS
                                        }
                                    })
                                ).then(result => {
                                    if (result.error === 0) {
                                        this.props.showVoteFn();
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    }

    getRedeem(publicKey) {
        const data = this.state.data;
        const len = data.length;
        for (let i = 0; i < len; i++) {
            if (data[i].operation.publicKey === publicKey) {
                this.props.obtainInfo(data[i].nodeName, data[i].operation.publicKey);
            }
        }
        this.props.showRedeem();
    }

    render() {
        const voteInfoColumn = this.getVoteInfoColumn();
        const {data, pagination, loading}  = this.state;
        const {handleTableChange} = this;
        return (
            <div className='vote-table' style={this.props.style} ref='voting'>
                <Table
                    columns={voteInfoColumn}
                    dataSource={data}
                    onChange={handleTableChange}
                    loading={loading}
                    pagination={pagination}
                />
            </div>
        );
    }
}
