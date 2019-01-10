/**
 * @file
 * @author zhouminghui
 * Forms need to be split up
*/

import React, {PureComponent} from 'react';
import Button from '../../Button/Button';
import {Table} from 'antd';
import getCurrentVotingRecord from '../../../utils/getCurrentVotingRecord';
import getCandidatesList from '../../../utils/getCandidatesList';
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
                showTotal: total => `Total ${total} items`,
                onChange: () => {
                    // const setTop = this.refs.voting.offsetTop;
                    // window.scrollTo(0, setTop);
                }
            }
        };
        this.currentVotingRecord = getCurrentVotingRecord(this.props.currentWallet).VotingRecords;
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
                                    this.props.showMyVote();
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

    async componentDidMount() {
        await this.nodeListInformation(
            {
                page,
                pageSize
            }
        );
    }

    nodeListInformation = async (params = {}) => {
        this.setState({
            loading: true
        });
        const data = getCandidatesList(this.state.currentWallet, ...params);
        let dataList = null;
        let currentVotingRecord = this.currentVotingRecord;
        let pagination = this.state.pagination;
        pagination.total = data.CandidatesNumber;
        if (data.dataList) {
            dataList = data.dataList;
            for (let i = 0; i < dataList.length; i++) {
                let myVote = 0;
                if (currentVotingRecord) {
                    for (let j = 0; j < currentVotingRecord.length; j++) {
                        if (currentVotingRecord[j].To === dataList[i].operation.publicKey) {
                            myVote += parseInt(currentVotingRecord[j].Count, 10);
                        }
                    }
                }
                if (myVote === 0) {
                    dataList[i].myVote = '-';
                }
                else {
                    dataList[i].myVote = myVote;
                }
            }
        }
        this.setState({
            loading: false,
            data: dataList || null,
            pagination
        });
    }

    static getDerivedStateFromProps(props, state) {
        if (props.currentWallet !== state.walletInfo) {
            return {
                currentWallet: props.currentWallet
            };
        }

        if (props.refresh !== state.refresh) {
            return {
                refresh: props.refresh
            };
        }

        return null;
    }

    handleTableChange = pagination => {
        let pageOption = this.state.pagination;
        pageOption.current = pagination.current;
        this.setState({
            pagination: pageOption
        });
        page = 10 * (pagination.current - 1);
        pageSize = page + 10;
        this.getDerivedStateFromProps({
            page,
            pageSize
        });
    };

    componentWillUnmount() {
        this.setState = () => {};
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
            this.currentVotingRecord = getCurrentVotingRecord(this.props.currentWallet).VotingRecords;
            await this.nodeListInformation(
                {
                    page,
                    pageSize
                }
            );
        }
        if (prevProps.refresh !== this.props.refresh) {
            this.currentVotingRecord = getCurrentVotingRecord(this.props.currentWallet).VotingRecords;
            await this.nodeListInformation(
                {
                    page,
                    pageSize
                }
            );
        }
    }

    getVoting(publicKey) {
        const data = this.state.data;
        const len = data.length;
        for (let i = 0; i < len; i++) {
            if (data[i].operation.publicKey === publicKey) {
                this.props.obtainInfo(data[i].nodeName, data[i].operation.publicKey);
            }
        }
        this.props.showVote();
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
