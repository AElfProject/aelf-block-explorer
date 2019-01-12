/**
 * @file VotingRecord
 * @author zhouminghui
*/

import React, {PureComponent} from 'react';
import {Table} from 'antd';
import './VotingRecord.less';
import getVotingRecord from '../../../utils/getVotingRecord';

let page = 0;
let pageSize = 10;
export default class VotingRecord extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
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
            },
            data: null,
            contracts: this.props.contracts
        };
    }

    votingRecordsData = async (params = {}) => {
        const {contracts} = this.state;
        this.setState({
            loading: true
        });
        const data = getVotingRecord(this.state.currentWallet, ...params, contracts.CONSENSUSADDRESS);
        let pagination = this.state.pagination;
        pagination.total = parseInt(data.historiesNumber, 10);
        if (data.dataList) {
            this.setState({
                data: data.dataList,
                loading: false
            });
        }
    }

    async componentDidMount() {
        await this.votingRecordsData({
            page,
            pageSize
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

    componentDidUpdate(prevProps) {
        if (prevProps.currentWallet !== this.props.currentWallet) {
            page = 0;
            pageSize = 10;
            let pageOption = this.state.pagination;
            pageOption.current = 1;
            this.setState({
                pagination: pageOption
            });
            this.votingRecordsData(
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
            this.votingRecordsData(
                {
                    page,
                    pageSize
                }
            );
        }
    }

    handleTableChange = pagination => {
        let pageOption = {...this.state.pagination};
        pageOption.current = pagination.current;
        this.setState({
            pagination: pageOption
        });
        page = 10 * (pagination.current - 1);
        pageSize = page + 10;
        this.votingRecordsData({
            page,
            pageSize
        });
    };

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
        const {pagination, data, loading} = this.state;
        const {handleTableChange} = this;
        const getVotingInfoColumn = this.getVotingInfoColumn();
        return (
            <div className='Voting-Record' style={this.props.style} ref='voting'>
                <Table
                    columns={getVotingInfoColumn}
                    pagination={pagination}
                    dataSource={data}
                    onChange={handleTableChange}
                    loading={loading}
                />
            </div>
        );
    }
}