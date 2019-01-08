/**
 * @file VotingRecord
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Table} from 'antd';
import './VotingRecord.less';
import getVotingRecord from '../../../utils/getVotingRecord';

export default class VotingRecord extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
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
            },
            data: null
        };
    }

    componentDidMount() {
        this.getVotingRecordData();
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
                data: getVotingRecord(this.state.currentWallet)
            });
        }

        if (prevProps.refresh !== this.props.refresh) {
            this.setState({
                data: getVotingRecord(this.state.currentWallet)
            });
        }
    }

    getVotingRecordData() {
        this.setState({
            data: getVotingRecord(this.state.currentWallet)
        });
    }

    getVotingInfoColumn() {
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
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                align: 'center'
            },
            {
                title: 'Number',
                dataIndex: 'number',
                key: 'number',
                align: 'center'
            },
            {
                title: 'State',
                dataIndex: 'state',
                key: 'state',
                align: 'center'
            },
            {
                title: 'Time',
                dataIndex: 'time',
                key: 'time',
                align: 'center'
            }
        ];
        return voteInfoColumn;
    }

    render() {
        const {pagination, data} = this.state;
        const getVotingInfoColumn = this.getVotingInfoColumn();
        return (
            <div className='Voting-Record' style={this.props.style} ref='voting'>
                <Table
                    columns={getVotingInfoColumn}
                    pagination={pagination}
                    dataSource={data}
                />
            </div>
        );
    }
}