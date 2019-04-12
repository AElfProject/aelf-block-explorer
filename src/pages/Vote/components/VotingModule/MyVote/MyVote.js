/**
 * @file MyVote component
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import Button from '../../../../../components/Button/Button';
import {Table, message} from 'antd';
import dayjs from 'dayjs';
import getPublicKey from '../../../../../utils/getPublicKey';
import contractChange from '../../../../../utils/contractChange';
import './MyVote.less';

let page = 0;
let pageSize = 10;
export default class MyVote extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentWallet: this.props.currentWallet,
            nightElf: this.props.nightElf,
            pageSize,
            appName: this.props.appName,
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


    // 获取当前账户投票记录 （未赎回）
    votingRecordInformation = async (params = {}) => {
        const {currentWallet, consensus} = this.state;
        let {pagination, page, pageSize} = params;
        this.setState({
            loading: true
        });
        let dataList = [];
        if (currentWallet) {
            if (currentWallet.address === '') {
                this.setState({
                    loading: false
                });
                return {dataList, VotingRecordsCount: 0};
            }
        }
        else {
            this.setState({
                loading: false
            });
            return {dataList, VotingRecordsCount: 0};
        }

        const key = getPublicKey(currentWallet.publicKey);
        const payload = {
            start: page,
            length: pageSize,
            publicKey: key
        };
        consensus.GetPageableNotWithdrawnTicketsInfo.call(payload, (error, result) => {
            if (result) {
                const ticketsInfoList = result.VotingRecords || [];
                const VotingRecordsCount = parseInt(
                    result.VotingRecordsCount, 10
                ) || 0;
                if (!ticketsInfoList.length) {
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
                        lockDate: dayjs(parseInt(item.VoteTimestamp.seconds + '000', 10)).format('YYYY-MM-DD HH:mm:ss'),
                        dueDate: dayjs(parseInt(item.UnlockTimestamp.seconds + '000', 10)).format('YYYY-MM-DD HH:mm:ss'),
                        operation: {
                            txId: item.TransactionId,
                            publicKey: item.To,
                            vote: true,
                            redeem: dayjs(new Date()).unix() > dayjs(item.UnlockTimestamp).unix()
                        }
                    };
                    dataList.push(data);
                    pagination.total = VotingRecordsCount;
                    this.getNodeName(dataList, index, item, pagination);
                });
            }
            else {
                this.setState({
                    loading: false
                });
            }
        });
    }


    // 获取节点名称
    getNodeName = async (dataList, index, item, pagination) => {
        const {consensus} = this.state;
        consensus.QueryAlias.call({hex: item.To}, (error, result) => {
            if (result) {
                const {
                    Value,
                    value
                } = result;
                const content = Value || value || '';
                dataList[index].nodeName = content;
                let temp = Array.from(dataList);
                this.setState({
                    data: temp,
                    pagination
                });
            }
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
        this.setState = function () {};
    }

    getVoting(publicKey) {
        const {data, currentWallet, appName, nightElf} = this.state;
        const len = data.length;
        for (let i = 0; i < len; i++) {
            if (data[i].operation.publicKey === publicKey) {
                this.props.obtainInfo(data[i].nodeName, data[i].operation.publicKey);
            }
        }

        nightElf.checkPermission({
            appName,
            type: 'address',
            address: currentWallet.address
        }, (error, result) => {
            if (result && result.error === 0) {
                contractChange(nightElf, result, currentWallet).then(result => {
                    if (!result) {
                        this.hasPermission();
                    }
                    else {
                        message.info('Contract renewal completed...', 3);
                    }
                });
            }
            else {
                message.warning(result.errorMessage.message, 3);
            }
        });
    }

    hasPermission() {
        const {currentWallet, contracts, appName} = this.state;
        window.NightElf.api({
            appName,
            method: 'INIT_AELF_CONTRACT',
            // hostname: 'aelf.io',
            chainId: 'AELF',
            payload: {
                address: currentWallet.address,
                contractName: 'token',
                contractAddress: contracts.multiToken
            }
        }).then(
            window.NightElf.api({
                appName,
                method: 'INIT_AELF_CONTRACT',
                // hostname: 'aelf.io',
                chainId: 'AELF',
                payload: {
                    address: currentWallet.address,
                    contractName: 'consensus',
                    contractAddress: contracts.consensusDPoS
                }
            })
        ).then(result => {
            if (result.error === 0) {
                this.props.showVote();
            }
        });
    }

    getRedeem(publicKey, txId, appName) {
        const {data, currentWallet, nightElf} = this.state;
        const len = data.length;
        for (let i = 0; i < len; i++) {
            if (data[i].operation.txId === txId) {
                this.props.obtainInfo(data[i].nodeName, publicKey, data[i].myVote, txId);
            }
        }

        nightElf.checkPermission({
            appName,
            type: 'address',
            address: currentWallet.address
        }, (error, result) => {
            if (result && result.error === 0) {
                contractChange(nightElf, result, currentWallet).then(result => {
                    if (!result) {
                        this.props.showRedeem();
                    }
                    else {
                        message.info('Contract renewal completed...', 3);
                    }
                });
            }
            else {
                message.warning(result.errorMessage.message, 3);
            }
        });

        nightElf.checkPermission({
            appName,
            type: 'address',
            address: currentWallet.address
        }, (error, result) => {
            if (result && result.error === 0) {
                contractChange(nightElf, result, currentWallet).then(result => {
                    if (!result) {
                        this.props.showRedeem();
                    }
                    else {
                        message.info('Contract renewal completed...', 3);
                    }
                });
            }
            else {
                message.warning(result.errorMessage, 3);
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

        if (props.nightElf !== state.nightElf) {
            return {
                nightElf: props.nightElf
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
                    this.getTickets();
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
                    this.getTickets();
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
                    this.getTickets();
                });
            }
        }
    }

    getTickets() {
        const {consensus} = this.state;
        consensus.GetTicketsCount.call((error, result) => {
            if (result) {
                const {
                    value,
                    Value
                } = result;
                this.setState({
                    allVotes: value || Value || 0,
                    loading: false
                });
            }
            this.props.endRefresh();
        });
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
                    let isVote = text.vote
                    ? {background: '#097d25', margin: '5px'} : {background: '#aaa', margin: '5px'};
                    let isRedeem = text.redeem
                    ? {background: '#feb000', margin: '5px'} : {background: '#aaa', margin: '5px'};
                    return (
                        <div style={{textAlign: 'center'}}>
                            <Button title='Vote' style={isVote} click={() => {
                                    if (text.vote) {
                                        this.getVoting(text.publicKey);
                                    }
                                }
                            }
                            />
                            <Button title='Redeem' style={isRedeem} click={() => {
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