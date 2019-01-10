/**
 * @file MyVote component
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import Button from '../../Button/Button';
import {Table} from 'antd';
import getMyVoteData from '../../../utils/getMyVoteData';

import './MyVote.less';

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
                showTotal: total => `Total ${total} items`,
                onChange: () => {
                    // const setTop = this.refs.voting.offsetTop;
                    // window.scrollTo(0, setTop);
                }
            },
            loading: false,
            data: null
        };
    }

    async componentDidMount() {
        await this.votingRecordInformation(
            {
                page,
                pageSize
            }
        );
    }

    votingRecordInformation = async (params = {}) => {
        this.setState({
            loading: true
        });

        const data = getMyVoteData(this.state.currentWallet, ...params);
        let dataList = null;
        if (data.dataList) {
            dataList = data.dataList;
            let pagination = this.state.pagination;
            pagination.total = parseInt(data.VotingRecordsCount, 10);
            this.setState({
                loading: false,
                data: dataList || null,
                pagination
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
        this.votingRecordInformation({
            page,
            pageSize
        });
    };

    componentWillUnmount() {
        this.setState = () => {};
    }

    getVoting(publicKey) {
        const data = this.state.data;
        const len = data.length;
        for (let i = 0; i < len; i++) {
            if (data[i].operation.publicKey === publicKey) {
                this.props.obtainInfo(data[i].nodeName, publicKey);
            }
        }
        this.props.showVote();
    }

    getRedeem(publicKey, txId) {
        const data = this.state.data;
        const len = data.length;
        for (let i = 0; i < len; i++) {
            if (data[i].operation.txId === txId) {
                this.props.obtainInfo(data[i].nodeName, publicKey, data[i].myVote, txId);
            }
        }
        this.props.showRedeem();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.currentWallet !== state.currentWallet) {
            return {
                currentWallet: props.currentWallet
            };
        }
        return null;
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.currentWallet !== this.props.currentWallet) {
            page = 0;
            pageSize = 10;
            let pageOption = this.state.pagination;
            pageOption.current = 1;
            this.setState({
                pagination: pageOption
            });
            await this.votingRecordInformation(
                {
                    page,
                    pageSize
                }
            );
        }

        if (prevProps.refresh !== this.props.refresh) {
            page = 0;
            pageSize = 10;
            let pageOption = this.state.pagination;
            pageOption.current = 1;
            this.setState({
                pagination: pageOption
            });
            await this.votingRecordInformation(
                {
                    page,
                    pageSize
                }
            );
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
                    let barWidth = parseInt(vote, 10) / 100000;
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