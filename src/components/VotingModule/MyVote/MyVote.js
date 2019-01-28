/**
 * @file MyVote component
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import Button from '../../Button/Button';
import {Table, message} from 'antd';
import getPublicKey from '../../../utils/getPublicKey';
import getMyVoteData from '../../../utils/getMyVoteData';
import getHexNumber from '../../../utils/getHexNumber';
import dayjs from 'dayjs';

import './MyVote.less';
import hexCharCodeToStr from '../../../utils/hexCharCodeToStr';

let page = 0;
let pageSize = 10;
export default class MyVote extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentWallet: this.props.currentWallet,
            pageSize,
            pagination: {
                showQuickJumper: true,
                total: 0,
                showTotal: total => `Total ${total} items`
            },
            loading: false,
            data: null,
            contracts: this.props.contracts,
            consensus: this.props.consensus,
            showMyVote: this.props.showMyVote
        };
    }

    votingRecordInformation = async (params = {}) => {
        const {currentWallet, consensus} = this.state;
        let {pagination, page, pageSize} = params;
        this.setState({
            loading: true
        });
        let dataList = [];
        if (currentWallet) {
            if (currentWallet.address === '') {
                return {dataList, VotingRecordsCount: 0};
            }
        }
        else {
            return {dataList, VotingRecordsCount: 0};
        }

        const key = getPublicKey(currentWallet.publicKey);
        consensus.GetPageableNotWithdrawnTicketsInfoToFriendlyString(key, page, pageSize, (error, result) => {
            const ticketsInfoList = JSON.parse(hexCharCodeToStr(result.return)).VotingRecords || [];
            const VotingRecordsCount = parseInt(
                JSON.parse(hexCharCodeToStr(result.return)).VotingRecordsCount, 10
            ) || 0;

            if (ticketsInfoList.length === 0) {
                this.setState({
                    data: [],
                    loading: false,
                    pagination
                });
                return;
            }

            ticketsInfoList.map((item, index) => {
                let data = {
                    key: page + index + 1,
                    serialNumber: page + index + 1,
                    nodeName: null,
                    term: item.TermNumber,
                    To: item.To,
                    From: item.From,
                    vote: item.Count,
                    myVote: item.Count,
                    lockDate: dayjs(item.VoteTimestamp).format('YYYY-MM-DD'),
                    dueDate: dayjs(item.UnlockTimestamp).format('YYYY-MM-DD'),
                    operation: {
                        txId: item.TransactionId,
                        publicKey: item.To,
                        vote: true,
                        redeem: dayjs(new Date()).unix() < dayjs(item.UnlockTimestamp).unix()
                    }
                };
                dataList.push(data);
                pagination.total = VotingRecordsCount;
                this.getNodeName(dataList, index, item, pagination);
            });

        });
    }



    getNodeName = async (dataList, index, item, pagination) => {
        const {consensus} = this.state;
        consensus.QueryAlias(item.To, (error, result) => {
            dataList[index].nodeName = hexCharCodeToStr(result.return);
            let temp = Array.from(dataList);
            this.setState({
                data: temp,
                pagination
            });
        });

        if (dataList.length - 1 === index) {
            this.setState({
                loading: false
            });
        }
    }

    handleTableChange = pagination => {
        let pageOption = this.state.pagination;
        pageOption.current = pagination.current;
        this.setState({
            pagination: pageOption
        });
        page = 10 * (pagination.current - 1);
        pageSize = page + 10;
        this.votingRecordInformation(
            {
                page,
                pageSize,
                pagination: pageOption
            }
        );
    };

    componentWillUnmount() {
        this.setState = () => {};
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
                                this.props.showVote();
                            }
                        });
                    }
                    else {
                        message.error(result.errorMessage, 5);
                    }
                });
            }
            else {
                result.permissions.map((item, index) => {
                    if (item.address === currentWallet.address) {
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
                                this.props.showVote();
                            }
                        });
                    }
                });
            }
        });
    }

    getRedeem(publicKey, txId) {
        const {data, currentWallet, contracts} = this.state;
        const len = data.length;
        for (let i = 0; i < len; i++) {
            if (data[i].operation.txId === txId) {
                this.props.obtainInfo(data[i].nodeName, publicKey, data[i].myVote, txId);
            }
        }
        window.NightElf.api({
            appName: 'hzzTest',
            method: 'CHECK_PERMISSION',
            type: 'address', // if you did not set type, it aways get by domain.
            address: currentWallet.address
        }).then(result => {
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
                                contractName: 'consensus',
                                contractAddress: contracts.CONSENSUSADDRESS
                            }
                        }).then(result => {
                            if (result.error === 0) {
                                this.props.showRedeem();
                            }
                        });
                    }
                    else {
                        message.error(result.errorMessage, 5);
                    }
                });
            }
            else {
                result.permissions.map((item, index) => {
                    if (item.address === currentWallet.address) {
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
                        }).then(result => {
                            if (result.error === 0) {
                                this.props.showRedeem();
                            }
                        });
                    }
                });
            }
        });
    }

    static getDerivedStateFromProps(props, state) {
        if (props.currentWallet !== state.currentWallet) {
            return {
                currentWallet: props.currentWallet
            };
        }
        if (props.contracts !== state.contracts) {
            return {
                contracts: props.contracts
            };
        }

        if (props.consensus !== state.consensus) {
            return {
                consensus: props.consensus
            };
        }

        if (props.showMyVote !== state.showMyVote) {
            return {
                showMyVote: props.showMyVote
            };
        }

        if (props.refresh !== state.refresh) {
            return {
                refresh: props.refresh
            };
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        if (prevProps.showMyVote !== this.props.showMyVote) {
            const {consensus, showMyVote, pagination} = this.state;
            if (consensus && showMyVote) {
                page = 0;
                pageSize = 10;
                pagination.current = 1;
                this.votingRecordInformation(
                    {
                        page,
                        pageSize,
                        pagination
                    }
                ).then(() => {
                    consensus.GetTicketsCount((error, result) => {
                        this.setState({
                            allVotes: getHexNumber(result.return),
                            loading: false
                        });
                        this.props.endRefresh();
                    });
                });
            }
        }

        if (prevProps.currentWallet !== this.props.currentWallet) {
            const {consensus, showMyVote, pagination} = this.state;
            if (consensus && showMyVote) {
                page = 0;
                pageSize = 10;
                pagination.current = 1;
                this.votingRecordInformation(
                    {
                        page,
                        pageSize,
                        pagination
                    }
                ).then(() => {
                    consensus.GetTicketsCount((error, result) => {
                        this.setState({
                            allVotes: getHexNumber(result.return),
                            loading: false
                        });
                        this.props.endRefresh();
                    });
                });
            }
        }

        if (prevProps.refresh !== this.props.refresh) {
            const {consensus, showMyVote, pagination} = this.state;
            if (consensus && showMyVote) {
                page = 0;
                pageSize = 10;
                pagination.current = 1;
                this.votingRecordInformation(
                    {
                        page,
                        pageSize,
                        pagination
                    }
                ).then(() => {
                    consensus.GetTicketsCount((error, result) => {
                        this.setState({
                            allVotes: getHexNumber(result.return),
                            loading: false
                        });
                        this.props.endRefresh();
                    });
                });
            }
        }
    }

    getMyVoteInfoColumn() {
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
                title: 'Number of votes obtained',
                dataIndex: 'vote',
                key: 'vote',
                align: 'center',
                render: vote => {
                    let barWidth = (parseInt(vote, 10) / this.state.allVotes) * 100;
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
                title: 'Lock date',
                dataIndex: 'lockDate',
                key: 'lockDate',
                align: 'center'
            },
            {
                title: 'Due date',
                dataIndex: 'dueDate',
                key: 'dueDate',
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
                                        this.getRedeem(text.publicKey, text.txId);
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

    render() {
        const {pagination, data, loading} = this.state;
        const {handleTableChange} = this;
        const getMyVoteInfoColumn = this.getMyVoteInfoColumn();
        return (
            <div className='my-vote' style={this.props.style} ref='voting'>
                <Table
                    pagination={pagination}
                    columns={getMyVoteInfoColumn}
                    onChange={handleTableChange}
                    dataSource={data}
                    loading={loading}
                />
            </div>
        );
    }
}