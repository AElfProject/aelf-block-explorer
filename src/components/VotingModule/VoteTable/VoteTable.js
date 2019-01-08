/**
 * @file
 * @author zhouminghui
 * Forms need to be split up
*/

import React, {PureComponent} from 'react';
import Button from '../../Button/Button';
import {Table} from 'antd';
import getCandidatesList from '../../../utils/getCandidatesList';
import './VoteTable.less';

export default class VoteTable extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            nodeName: null,
            currentWallet: this.props.currentWallet,
            refresh: 0,
            pagination: {
                showQuickJumper: true,
                showSizeChanger: true,
                total: 0,
                showTotal: total => `Total ${total} items`,
                onChange: () => {
                    const setTop = this.refs.voting.offsetTop;
                    window.scrollTo(0, setTop);
                },
                onShowSizeChange: (current, size) => {
                    console.log(current);
                    console.log(size);
                }
            }
        };
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
                    let barWidth = parseInt(vote, 10) / 10000;
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

    componentDidUpdate(prevProps) {
        if (prevProps.currentWallet !== this.props.currentWallet) {
            this.setState({
                data: getCandidatesList(this.state.currentWallet)
            });
        }
        if (prevProps.refresh !== this.props.refresh) {
            this.setState({
                data: getCandidatesList(this.state.currentWallet)
            });
        }
    }

    componentDidMount() {
        this.setState({
            data: getCandidatesList(this.state.currentWallet)
        });
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
        const {data, pagination}  = this.state;
        return (
            <div className='vote-table' style={this.props.style}>
                <Table
                    columns={voteInfoColumn}
                    dataSource={data}
                    pagination={pagination}
                />
            </div>
        );
    }
}
